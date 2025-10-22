import mongoose from 'mongoose';
const { Schema } = mongoose;

const fileSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: false // Made optional to allow root folder creation during project setup
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'File',
    default: null // null for root folder
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['folder', 'file'],
    required: true
  },
  // Only applicable for files
  s3Key: {
    type: String // e.g. "projects/<projectId>/src/App.js"
  },
  language: {
    type: String, // "javascript", "jsx", "css", etc.
    sparse: true // Only required for files
  },
  sizeInBytes: {
    type: Number, // file size
    default: 0
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt
});

// Indexes for performance and constraints
fileSchema.index({ projectId: 1, parentId: 1 }); // Fast folder listing
fileSchema.index({ s3Key: 1 }, { unique: true, sparse: true }); // Unique S3 keys
fileSchema.index({ projectId: 1, 'name': 1, 'parentId': 1 }, { unique: true }); // Unique names within folder

// Virtual for full path
fileSchema.virtual('path').get(function() {
  // This should be populated when needed using an aggregation pipeline
  return this._path;
});

// Pre-save hook to set s3Key
fileSchema.pre('save', async function(next) {
  if (this.type === 'file' && !this.s3Key) {
    // Generate S3 key based on project and file path
    // Will be set properly by the file service when uploading
    this.s3Key = `projects/${this.projectId}/${this.name}`;
  }
  next();
});

// Pre-save hook to validate file-specific fields
fileSchema.pre('save', function(next) {
  if (this.type === 'file') {
    if (!this.language) {
      next(new Error('Language is required for files'));
      return;
    }
  } else {
    // Clear file-specific fields for folders
    this.s3Key = undefined;
    this.language = undefined;
    this.sizeInBytes = 0;
  }
  next();
});

const File = mongoose.model('File', fileSchema);
export default File;