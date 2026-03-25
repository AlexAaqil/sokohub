import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, FireIcon, ChatBubbleLeftIcon, Squares2X2Icon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../context/AuthContext';
import { Logo } from '../Logo/Logo';
import { UserMenu } from '../UserMenu/UserMenu';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Discover', icon: HomeIcon, path: '/' },
    { id: 'deals', label: 'Deals & Offers', icon: FireIcon, path: '/deals' },
    { id: 'social', label: 'Community', icon: ChatBubbleLeftIcon, path: '/social', hasNotification: true },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    navigate(tab.path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
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
          <div className="flex items-center gap-2">
            {/* List Product button - only for sellers */}
            {user && user.role === 'seller' && (
              <button 
                onClick={() => navigate('/dashboard')}
                className="hidden sm:block px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap"
              >
                + List Product
              </button>
            )}
            
            {/* User Menu (desktop and mobile) */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 text-sm hover:text-gray-900"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-5 h-5 text-gray-600" />
              ) : (
                <Bars3Icon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            {/* Mobile tabs */}
            <div className="flex flex-col gap-1 mb-4">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.hasNotification && (
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block" />
                  )}
                </button>
              ))}
            </div>

            {/* List Product button for mobile */}
            {user && user.role === 'seller' && (
              <button 
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 mb-2"
              >
                <Squares2X2Icon className="w-5 h-5" />
                List Product
              </button>
            )}

            {/* User info for mobile (if logged in) */}
            {user && (
              <div className="pt-3 mt-2 border-t border-gray-100">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                </div>
              </div>
            )}

            {/* Login/Register for mobile */}
            {!user && (
              <div className="flex gap-2 pt-3 mt-2 border-t border-gray-100">
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};