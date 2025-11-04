import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex space-x-4 items-center">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              Health Tracker
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-primary px-3 py-2">
              Dashboard
            </Link>
            <Link to="/trackers" className="text-gray-700 hover:text-primary px-3 py-2">
              Trackers
            </Link>
            <Link to="/goals" className="text-gray-700 hover:text-primary px-3 py-2">
              Goals
            </Link>
            <Link to="/ai-assistant" className="text-gray-700 hover:text-primary px-3 py-2">
              AI Assistant
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-700 hover:text-primary">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
