import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Printer } from 'lucide-react';

function AssetViewModal({ isOpen, onClose, asset }) {
  if (!asset) return null;

  const { staffDetails, devices, signatures, submittedAt } = asset;

  const handlePrint = () => {
    window.open(`/print-asset/${asset.id}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Handover Details</h1>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
                <X size={24} className="text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Staff Details */}
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Staff Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-gray-50 p-4 rounded-lg">
                  <div><strong className="text-gray-600">Full Name:</strong> {staffDetails.fullName}</div>
                  <div><strong className="text-gray-600">Staff ID:</strong> {staffDetails.staffId}</div>
                  <div><strong className="text-gray-600">Position:</strong> {staffDetails.position}</div>
                  <div><strong className="text-gray-600">Department:</strong> {staffDetails.department}</div>
                  <div className="md:col-span-2"><strong className="text-gray-600">Date of Issue:</strong> {new Date(submittedAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</div>
                </div>
              </section>

              {/* Devices */}
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Devices Issued</h2>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Device Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {devices.map((device, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{device.deviceType}</td>
                          <td className="px-4 py-3 text-sm">{device.brand}</td>
                          <td className="px-4 py-3 text-sm">{device.model}</td>
                          <td className="px-4 py-3 text-sm font-mono">{device.serialNumber}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Signatures */}
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Signatures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <h3 className="font-medium text-gray-700 mb-2">Staff Signature</h3>
                    <div className="bg-gray-100 border rounded-lg p-2 h-32 flex items-center justify-center">
                      <img src={signatures.staffSignature} alt="Staff Signature" className="max-h-full" />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-gray-700 mb-2">Admin Signature</h3>
                    <div className="bg-gray-100 border rounded-lg p-2 h-32 flex items-center justify-center">
                      <img src={signatures.adminSignature} alt="Admin Signature" className="max-h-full" />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-4 p-6 border-t border-gray-200 flex-shrink-0">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">Close</button>
              <button type="button" onClick={handlePrint} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark shadow-sm hover:shadow-md transition-all">
                <Printer size={18} />
                Print
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AssetViewModal;
