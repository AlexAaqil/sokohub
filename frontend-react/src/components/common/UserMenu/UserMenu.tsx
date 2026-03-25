import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  UserIcon, 
  Cog6ToothIcon, 
  ShoppingBagIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  BriefcaseIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = () => {
    switch (user.role) {
      case 'seller':
        return <BriefcaseIcon className="w-3 h-3" />;
      case 'admin':
        return <Cog6ToothIcon className="w-3 h-3" />;
      default:
        return <ShoppingCartIcon className="w-3 h-3" />;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'seller':
        return 'bg-blue-50 text-blue-600';
      case 'admin':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* User button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
          {getInitials(user.full_name)}
        </div>
        
        {/* User info - hidden on mobile, visible on tablet/desktop */}
        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{user.full_name}</span>
            {/* Role badge - visible on desktop */}
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor()}`}>
              {getRoleIcon()}
              <span className="capitalize">{user.role}</span>
            </span>
          </div>
        </div>
        
        {/* Chevron icon */}
        <ChevronDownIcon className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User info - visible on mobile only */}
          <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor()}`}>
                {getRoleIcon()}
                <span className="capitalize">{user.role}</span>
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{user.email}</p>
          </div>

          {/* User info - visible on desktop within dropdown (optional) */}
          <div className="hidden sm:block px-4 py-2 border-b border-gray-100">
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu items */}
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ShoppingBagIcon className="w-4 h-4 text-gray-500" />
            My Dashboard
          </button>
          
          <button
            onClick={() => handleNavigation('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <UserIcon className="w-4 h-4 text-gray-500" />
            Profile Settings
          </button>
          
          <button
            onClick={() => handleNavigation('/settings')}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
            Account Settings
          </button>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};