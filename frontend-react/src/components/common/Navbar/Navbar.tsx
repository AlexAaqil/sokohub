import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, FireIcon, ChatBubbleLeftIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

export const Navbar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', label: 'Discover', icon: HomeIcon, path: '/' },
    { id: 'deals', label: 'Deals & Offers', icon: FireIcon, path: '/deals' },
    { id: 'social', label: 'Community', icon: ChatBubbleLeftIcon, path: '/social', hasNotification: true },
    { id: 'dashboard', label: 'My Shop', icon: Squares2X2Icon, path: '/dashboard' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="font-serif text-xl">
            Soko<span className="text-gray-500 italic">hub</span>
          </Link>

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
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              + List Product
            </button>
            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm cursor-pointer">
              KM
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};