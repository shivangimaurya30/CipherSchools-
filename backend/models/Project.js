import mongoose from 'mongoose';
const { Schema } = mongoose;

const projectSettingsSchema = new Schema({
  framework: { 
    type: String, 
    default: 'react',
    enum: ['react', 'vanilla-js', 'vue', 'svelte']
  },
  autoSave: { 
    type: Boolean, 
    default: true 
  }
}, { _id: false });

const projectSchema = new Schema({
  projectSlug: { 
    type: String, 
    unique: true, 
    index: true,
    required: true
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    default: null // null for non-authenticated projects
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String,
    trim: true,
    default: ''
  },
  rootFolderId: { 
    type: Schema.Types.ObjectId, 
    ref: 'File',
    required: true
  },
  settings: {
    type: projectSettingsSchema,
    default: () => ({})
  }
}, { 
  timestamps: true // This adds createdAt and updatedAt fields
});

// Create URL-friendly slug from project name
projectSchema.pre('save', function(next) {
  if (!this.projectSlug || this.isModified('name')) {
    this.projectSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;