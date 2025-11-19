import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout({ onLogout, currentUser, searchQuery, setSearchQuery }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();

  const isMobile = () => window.innerWidth <= 1024;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-brand-gray-100 overflow-hidden no-print">
      {isSidebarOpen && isMobile() && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          aria-hidden="true"
        />
      )}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onLogout={onLogout} 
          toggleSidebar={toggleSidebar} 
          currentUser={currentUser} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-4 md:p-8">
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
