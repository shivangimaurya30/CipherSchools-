import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './stores/authStore';

// Import components
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import IDE from './components/ide/IDE';
import ProjectsList from './components/projects/ProjectsList';
import NotFound from './components/common/NotFound';

// Import styles
import './styles/main.css';
import './styles/layout.css';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/projects" />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <Register /> : <Navigate to="/projects" />}
          />

          {/* Protected routes with Layout */}
          <Route
            path="/projects"
            element={
              isAuthenticated ? (
                <Layout>
                  <ProjectsList />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/project/:id"
            element={
              isAuthenticated ? (
                <Layout>
                  <IDE />
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Default routes */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/projects" : "/login"} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
