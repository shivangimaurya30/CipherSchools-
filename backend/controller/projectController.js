import mongoose from 'mongoose';
import Project from '../models/Project.js';
import File from '../models/File.js';
import { createError } from '../utils/error.js';

// @desc    Create a new project
// @route   POST /api/projects
// @access  Public/Private
export const createProject = async (req, res, next) => {
  try {
    const { name, description, settings } = req.body;
    const userId = req.user?._id || null;
    
    // Generate project slug from name
    const projectSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    console.log('Creating project with name:', name);
    console.log('Generated slug:', projectSlug);

    // Create project first with a temporary rootFolderId
    const project = await Project.create({
      name,
      description,
      userId,
      rootFolderId: new mongoose.Types.ObjectId(), // Temporary ID
      projectSlug,
      settings: {
        framework: settings?.framework || 'react',
        autoSave: settings?.autoSave ?? true
      }
    });

    // Create root folder with projectId
    const rootFolder = await File.create({
      name: '/',
      type: 'folder',
      projectId: project._id,
      parentId: null,
      userId
    });

    // Update project with actual rootFolderId
    project.rootFolderId = rootFolder._id;
    await project.save();

    console.log('Project created successfully with slug:', project.projectSlug);
    console.log('Project ID:', project._id);

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public/Private
export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    let query = {};

    // If user is authenticated, show their projects and public projects
    if (userId) {
      query = { 
        $or: [
          { userId },
          { userId: null } // Include non-authenticated projects
        ]
      };
    } else {
      // If not authenticated, only show public projects
      query = { userId: null };
    }

    const projects = await Project.find(query)
      .select('-__v')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: projects
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Get single project
// @route   GET /api/projects/:projectSlug
// @access  Public/Private
export const getProject = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    const requestedSlug = req.params.projectSlug;
    
    console.log('Looking for project with slug:', requestedSlug);
    console.log('User ID:', userId);
    
    const query = {
      projectSlug: requestedSlug,
      $or: [
        { userId },
        { userId: null } // Include public projects
      ]
    };

    console.log('Query:', JSON.stringify(query, null, 2));

    const project = await Project.findOne(query).select('-__v');

    if (!project) {
      console.log('Project not found with slug:', requestedSlug);
      // Let's also check if any projects exist with similar slugs
      const allProjects = await Project.find({}).select('projectSlug name');
      console.log('All projects:', allProjects.map(p => ({ slug: p.projectSlug, name: p.name })));
      return next(createError(404, 'Project not found'));
    }

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Update project
// @route   PUT /api/projects/:projectSlug
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const { name, description, settings } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return next(createError(401, 'Authentication required'));
    }

    const project = await Project.findOne({
      projectSlug: req.params.projectSlug,
      userId
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    // Update fields if provided
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (settings) {
      project.settings = {
        ...project.settings,
        ...settings
      };
    }

    await project.save();

    res.status(200).json({
      success: true,
      data: project
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:projectSlug
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return next(createError(401, 'Authentication required'));
    }

    const project = await Project.findOne({
      projectSlug: req.params.projectSlug,
      userId
    });

    if (!project) {
      return next(createError(404, 'Project not found'));
    }

    // Delete all files associated with the project
    await File.deleteMany({ projectId: project._id });
    
    // Delete the project
    await project.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(createError(500, err.message));
  }
};