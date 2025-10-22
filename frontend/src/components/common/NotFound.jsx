import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-2">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          The page you are looking for does not exist or has been moved to a different location.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}