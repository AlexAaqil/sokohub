import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, FireIcon, ChatBubbleLeftIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext';
import { Logo } from '../Logo/Logo';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Discover', icon: HomeIcon, path: '/' },
    { id: 'deals', label: 'Deals & Offers', icon: FireIcon, path: '/deals' },
    { id: 'social', label: 'Community', icon: ChatBubbleLeftIcon, path: '/social', hasNotification: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Logo />

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigate(tab.path);
                }}
                className={`px-4 py-1.5 rounded-lg text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.hasNotification && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block ml-1" />
                  )}
                </span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user && user.role === 'seller' && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
              >
                + List Product
              </button>
            )}
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{user.full_name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-1.5 text-sm hover:text-gray-900"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};