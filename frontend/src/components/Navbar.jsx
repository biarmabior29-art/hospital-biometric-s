import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HomeIcon, 
  InformationCircleIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  FingerPrintIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Updated nav link classes for professional blue-gray theme
  const navLinkClasses = "flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 hover:bg-gray-100 rounded-md transition-colors";

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FingerPrintIcon className="h-8 w-8 text-blue-700" />
            <span className="font-bold text-xl text-gray-900">
              Bio<span className="text-blue-700">Health</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={navLinkClasses}>
              <HomeIcon className="h-5 w-5 mr-1" /> Home
            </Link>
            <Link to="/about" className={navLinkClasses}>
              <InformationCircleIcon className="h-5 w-5 mr-1" /> About
            </Link>
            <Link to="/services" className={navLinkClasses}>
              <InformationCircleIcon className="h-5 w-5 mr-1" /> Services
            </Link>
            <Link to="/contact" className={navLinkClasses}>
              <InformationCircleIcon className="h-5 w-5 mr-1" /> Contact
            </Link> 
            
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={navLinkClasses}>Dashboard</Link>
                <Link to="/patients" className={navLinkClasses}>Patients</Link>
                <Link to="/appointments" className={navLinkClasses}>Appointments</Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-sm text-gray-700">{user?.firstName} {user?.lastName}</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">{user?.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-gray-700 hover:text-blue-700 focus:outline-none"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className={navLinkClasses} onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" className={navLinkClasses} onClick={() => setIsOpen(false)}>About</Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClasses} onClick={() => setIsOpen(false)}>Dashboard</Link>
                <Link to="/patients" className={navLinkClasses} onClick={() => setIsOpen(false)}>Patients</Link>
                <Link to="/appointments" className={navLinkClasses} onClick={() => setIsOpen(false)}>Appointments</Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navLinkClasses} onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/signup" className="block px-3 py-2 text-base font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md" onClick={() => setIsOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
