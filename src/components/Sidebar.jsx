import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PackagePlus, ShieldCheck, X } from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Add Assets', icon: PackagePlus, path: '/add-asset' },
];

const sidebarVariants = {
  open: (isMobile) => ({
    width: 256,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }),
  closed: (isMobile) => ({
    width: isMobile ? 256 : 80,
    x: isMobile ? '-100%' : 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }),
};

const itemVariants = {
  open: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  closed: { opacity: 0, x: -20, transition: { duration: 0.2 } },
};

function Sidebar({ isOpen, toggleSidebar }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      custom={isMobile}
      animate={isOpen ? 'open' : 'closed'}
      className="bg-white shadow-lg flex-col flex-shrink-0 z-30 fixed md:relative h-full"
    >
      <div className="flex items-center justify-between h-20 border-b border-brand-gray-200 px-4">
        <div className="flex items-center justify-center flex-grow">
          <motion.div
            animate={{ rotate: isOpen && !isMobile ? 0 : 360 }}
            transition={{ duration: 0.5 }}
          >
             <img src="/logo.png" alt="Logo" className='h-12 w-12 mr-3' />
          </motion.div>
          <AnimatePresence>
            {(isOpen || isMobile) && (
              <motion.span
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="text-xl font-bold text-brand-gray-800 ml-2 whitespace-nowrap"
              >
                IT Inventory
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-brand-gray-600 hover:text-brand-blue">
          <X size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex items-center h-12 rounded-lg text-brand-gray-600 hover:bg-brand-blue-light hover:text-brand-blue-dark transition-colors duration-200 relative ${
                    isActive ? 'bg-brand-blue-light text-brand-blue-dark font-semibold' : ''
                  }`
                }
              >
                <div className="w-20 flex items-center justify-center flex-shrink-0">
                  <link.icon size={24} />
                </div>
                <AnimatePresence>
                  {(isOpen || isMobile) && (
                    <motion.span
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="whitespace-nowrap"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </motion.aside>
  );
}

export default Sidebar;
