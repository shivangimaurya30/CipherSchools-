import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../../stores/projectStore';
import useAuthStore from '../../stores/authStore';
import ProjectCard from '../common/ProjectCard';
import { IconPlus, IconLogout, IconTemplate } from '@tabler/icons-react';

export default function ProjectsList() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { projects, fetchProjects, createProject, deleteProject, isLoading } = useProjectStore();
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectFramework, setProjectFramework] = useState('react');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    const project = await createProject(projectName, projectDescription, projectFramework);
    if (project) {
      setNewProjectModal(false);
      setProjectName('');
      setProjectDescription('');
      setProjectFramework('react');
      navigate(`/project/${project._id}`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    const success = await deleteProject(projectId);
    if (success) {
      fetchProjects();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">My Projects</h2>
            <p className="text-gray-400">Create and manage your coding projects</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNewProjectModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <IconPlus size={20} className="mr-2" />
              New Project
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-300 bg-gray-800 hover:bg-gray-700/80 border border-gray-700/50 hover:border-gray-600 transition-all duration-200"
            >
              <IconLogout size={20} className="mr-2" />
              Sign out
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <IconTemplate size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-200 mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-8">Create your first project to get started</p>
            <button
              onClick={() => setNewProjectModal(true)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <IconPlus size={20} className="mr-2" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onDelete={handleDeleteProject}
                onOpen={(id) => navigate(`/project/${id}`)}
              />
            ))}
          </div>
        )}

        {newProjectModal && (
          <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
              <div className="fixed inset-0 bg-black/75 transition-opacity" aria-hidden="true" onClick={() => setNewProjectModal(false)} />
              
              <div className="relative inline-block bg-gray-800 rounded-xl shadow-2xl transform transition-all max-w-lg w-full p-6 text-left align-middle border border-gray-700/50">
                <div className="absolute top-4 right-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-300 focus:outline-none p-1 hover:bg-gray-700/50 rounded-lg transition-colors"
                    onClick={() => setNewProjectModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      Create New Project
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Set up your project details and choose a framework to get started
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="projectName" className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="projectName"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:text-sm transition-colors"
                        placeholder="My Awesome Project"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        id="projectDescription"
                        rows="3"
                        className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 sm:text-sm transition-colors"
                        placeholder="Brief description of your project (optional)"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Framework
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'react', name: 'React', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png' },
                          { id: 'vanilla-js', name: 'Vanilla JS', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/512px-JavaScript-logo.png' },
                        ].map((fw) => (
                          <button
                            key={fw.id}
                            type="button"
                            onClick={() => setProjectFramework(fw.id)}
                            className={`relative flex items-center space-x-3 rounded-lg border ${
                              projectFramework === fw.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-gray-600 bg-gray-700/50 hover:bg-gray-700'
                            } p-4 transition-colors`}
                          >
                            <img src={fw.icon} alt={fw.name} className="h-6 w-6" />
                            <span className="text-sm font-medium text-white">{fw.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="button"
                      className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                        isLoading ? 'animate-pulse' : ''
                      }`}
                      onClick={handleCreateProject}
                      disabled={!projectName.trim() || isLoading}
                    >
                      <IconPlus size={20} className="mr-2" />
                      {isLoading ? 'Creating Project...' : 'Create Project'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}