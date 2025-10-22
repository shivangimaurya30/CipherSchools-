import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";
import { fileTypeFromBuffer } from 'file-type';
import { getLanguageFromExtension } from '../utils/fileUtils.js';
import { createError } from '../utils/error.js';
import Project from '../models/Project.js';
import File from '../models/File.js';

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const getS3Key = (projectId, path) => {
  return `projects/${projectId}${path}`.replace(/\/+/g, '/');
};

// @desc    Create a new file or folder
// @route   POST /api/files
// @access  Private
export const createFile = async (req, res, next) => {
  try {
    const { projectId, parentId, name, type, content } = req.body;
    const userId = req.user?._id;

    // Check if user owns the project
    const project = await Project.findOne({
      _id: projectId,
      userId
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    // Check if parent folder exists
    let parentPath = '/';
    if (parentId) {
      const parentFile = await File.findOne({
        _id: parentId,
        projectId,
        type: 'folder'
      });
      
      if (!parentFile) {
        return next(createError(404, 'Parent folder not found'));
      }
      parentPath = await getFilePath(parentFile);
    }

    // Create file path and S3 key
    const filePath = `${parentPath}${name}`;
    const s3Key = getS3Key(projectId, filePath);

    // Check for name conflicts
    const existingFile = await File.findOne({
      projectId,
      parentId,
      name
    });

    if (existingFile) {
      return next(createError(400, 'A file with this name already exists in this folder'));
    }

    // Create file record
    const file = new File({
      projectId,
      parentId,
      name,
      type,
      language: type === 'file' ? getLanguageFromExtension(name) : undefined
    });

    if (type === 'file') {
      // Upload to S3
      const buffer = Buffer.from(content || '', 'utf-8');
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: buffer,
        ContentType: 'text/plain'
      });

      await s3Client.send(command);
      
      file.s3Key = s3Key;
      file.sizeInBytes = buffer.length;
    }

    await file.save();

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Update file
// @route   PUT /api/files/:fileId
// @access  Private
export const updateFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { name, content } = req.body;
    const userId = req.user?._id;

    const file = await File.findById(fileId);
    if (!file) {
      return next(createError(404, 'File not found'));
    }

    const project = await Project.findOne({
      _id: file.projectId,
      userId
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    if (name && name !== file.name) {
      // Check for name conflicts in same folder
      const existingFile = await File.findOne({
        projectId: file.projectId,
        parentId: file.parentId,
        name,
        _id: { $ne: file._id }
      });

      if (existingFile) {
        return next(createError(400, 'A file with this name already exists in this folder'));
      }

      file.name = name;
      if (file.type === 'file') {
        file.language = getLanguageFromExtension(name);
      }
    }

    if (content !== undefined && file.type === 'file') {
      // Upload new content to S3
      const buffer = Buffer.from(content, 'utf-8');
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: file.s3Key,
        Body: buffer,
        ContentType: 'text/plain'
      });

      await s3Client.send(command);
      file.sizeInBytes = buffer.length;
    }

    await file.save();

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:fileId
// @access  Private
export const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?._id;

    const file = await File.findById(fileId);
    if (!file) {
      return next(createError(404, 'File not found'));
    }

    const project = await Project.findOne({
      _id: file.projectId,
      userId
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    if (file.type === 'folder') {
      // Get all files in folder recursively
      const files = await File.find({
        projectId: file.projectId,
        $or: [
          { _id: file._id },
          { parentId: file._id }
        ]
      });

      // Delete all files from S3
      for (const f of files) {
        if (f.type === 'file' && f.s3Key) {
          const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: f.s3Key
          });
          await s3Client.send(deleteCommand);
        }
      }

      // Delete all files from database
      await File.deleteMany({
        _id: { $in: files.map(f => f._id) }
      });
    } else {
      // Delete single file from S3
      if (file.s3Key) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: file.s3Key
        });
        await s3Client.send(deleteCommand);
      }

      await file.deleteOne();
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Get file content
// @route   GET /api/files/:fileId
// @access  Private/Public
export const getFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user?._id;

    const file = await File.findById(fileId);
    if (!file) {
      return next(createError(404, 'File not found'));
    }

    const project = await Project.findOne({
      _id: file.projectId,
      $or: [
        { userId },
        { userId: null }
      ]
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    // For files, get content from S3
    if (file.type === 'file' && file.s3Key) {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: file.s3Key
      });

      const response = await s3Client.send(command);
      const content = await streamToString(response.Body);

      res.status(200).json({
        success: true,
        data: {
          ...file.toObject(),
          content
        }
      });
    } else {
      res.status(200).json({
        success: true,
        data: file
      });
    }
  } catch (err) {
    next(createError(500, err.message));
  }
};

// Helper function to get full path of a file
const getFilePath = async (file) => {
  const parts = [];
  let current = file;

  while (current) {
    parts.unshift(current.name);
    if (current.parentId) {
      current = await File.findById(current.parentId);
    } else {
      break;
    }
  }

  return '/' + parts.join('/');
};

// Helper function to convert stream to string
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });