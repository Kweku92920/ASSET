import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, Briefcase, Building, X } from 'lucide-react';

const departments = ['Information Management', 'Human Resource', 'Estate', 'Finance', 'Missions', 'Procurement'];

function UserFormModal({ isOpen, onClose, onSubmit, user }) {
  const [formData, setFormData] = useState({
    fullName: '',
    staffId: '',
    position: '',
    department: '',
    role: 'User',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        staffId: user.staffId || '',
        position: user.position || '',
        department: user.department || '',
        role: user.role || 'User',
      });
    } else {
      setFormData({
        fullName: '',
        staffId: '',
        position: '',
        department: '',
        role: 'User',
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{user ? 'Edit User' : 'Create New User'}</h1>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="e.g., Jane Doe" required className="w-full bg-white border border-brand-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                  </div>
                </div>
                <div>
                  <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
                  <input type="text" id="staffId" name="staffId" value={formData.staffId} onChange={handleInputChange} placeholder="e.g., EMP12345" required className="w-full bg-white border border-brand-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                </div>
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <div className="relative">
                    <Briefcase size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
                    <input type="text" id="position" name="position" value={formData.position} onChange={handleInputChange} placeholder="e.g., Frontend Developer" required className="w-full bg-white border border-brand-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                  </div>
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <div className="relative">
                    <Building size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-400" />
                    <select id="department" name="department" value={formData.department} onChange={handleInputChange} required className="w-full bg-white border border-brand-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue appearance-none">
                      <option value="">Select a department</option>
                      {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select id="role" name="role" value={formData.role} onChange={handleInputChange} required className="w-full bg-white border border-brand-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-lg font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark shadow-sm hover:shadow-md transition-all">
                  {user ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default UserFormModal;
