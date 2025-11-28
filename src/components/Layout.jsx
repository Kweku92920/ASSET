import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Layout component.
 * This wraps all the "inside the app" pages and shows:
 * - the sidebar on the left
 * - the header at the top
 * - the main page content in the center
 */
function Layout({ onLogout, currentUser, searchQuery, setSearchQuery }) {
  // We remember if the sidebar should be visible or not.
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    window.innerWidth > 1024
  );
  const location = useLocation();

  // Helper function to check if we are on a small screen.
  const isMobile = () => window.innerWidth <= 1024;

  // === HANDLE WINDOW RESIZE ===
  // When the window resizes we open the sidebar on large screens
  // and close it on smaller screens.
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Run once when the component first loads.
    handleResize();

    // Clean up the event listener when the component is removed.
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === CLOSE SIDEBAR ON ROUTE CHANGE (MOBILE) ===
  useEffect(() => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
  }, [location]);

  // Toggle function used by the header menu button.
  const toggleSidebar = () => {
    setIsSidebarOpen((previousValue) => !previousValue);
  };

  // === LAYOUT STRUCTURE ===
  return (
    <div className="flex h-screen bg-brand-gray-100 overflow-hidden no-print">
      {/* Dark overlay behind sidebar on mobile devices. */}
      {isSidebarOpen && isMobile() && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Left sidebar navigation. */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Right side: header and page content. */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onLogout={onLogout}
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main scrolling area where routed pages are shown. */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-gray-100 p-4 md:p-8">
          <div className="container mx-auto max-w-7xl">
            {/* React Router will render the matching page here. */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
