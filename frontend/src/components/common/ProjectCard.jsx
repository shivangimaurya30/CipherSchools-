import { IconClock, IconTrash, IconEdit, IconFolder } from '@tabler/icons-react';

export default function ProjectCard({ project, onDelete, onOpen }) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-700/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <IconFolder size={24} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onOpen(project._id)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Open project"
            >
              <IconEdit size={20} className="text-gray-400 hover:text-white" />
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Delete project"
            >
              <IconTrash size={20} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description || 'No description provided'}
        </p>

        <div className="flex items-center text-gray-500 text-sm">
          <IconClock size={16} className="mr-1" />
          Last modified: {new Date(project.updatedAt).toLocaleDateString()}
        </div>

        <button
          onClick={() => onOpen(project._id)}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          Open Project
        </button>
      </div>
    </div>
  );
}