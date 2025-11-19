import React, { useState } from 'react';
import { ChevronDown, LogOut, Menu, Search, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function Header({ onLogout, toggleSidebar, currentUser, searchQuery, setSearchQuery }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  if (!currentUser) return null;

  // Only show search bar on the dashboard
  const showSearchBar = location.pathname === '/';

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm h-20 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-brand-gray-600 hover:text-brand-blue transition-colors lg:hidden">
          <Menu size={24} />
        </button>
        {showSearchBar && (
          <div className="relative hidden md:block">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
            <input
              type="text"
              placeholder="Search by name, device, serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-72 bg-brand-gray-200 border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-gray-200 flex items-center justify-center text-brand-gray-500">
              <UserCircle size={24} />
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="font-semibold text-sm text-brand-gray-800">{currentUser.fullName}</span>
              <span className="text-xs text-brand-gray-500">{currentUser.position}</span>
            </div>
            <ChevronDown size={16} className={`text-brand-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20"
              >
                <button
                  onClick={onLogout}
                  className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-brand-gray-700 hover:bg-brand-blue-light hover:text-brand-blue-dark transition-colors"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Header;
