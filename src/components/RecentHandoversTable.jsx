import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Calendar, Edit, Trash2, Eye } from 'lucide-react';

function RecentHandoversTable({ assets, onDeleteAsset, onViewAsset }) {
  const navigate = useNavigate();

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
        <p className="mt-1 text-sm text-gray-500">Your search returned no results, or no assets have been recorded yet.</p>
      </div>
    );
  }

  const handleEdit = (handoverId) => {
    navigate(`/edit-asset/${handoverId}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device(s)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number(s)</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {assets.map((handover) => (
            <tr key={handover.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{handover.staffDetails.fullName}</div>
                    <div className="text-sm text-gray-500">{handover.staffDetails.department}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{handover.devices.length} Device(s)</div>
                <div className="text-sm text-gray-500 truncate" style={{ maxWidth: '200px' }}>
                  {handover.devices.map(d => d.deviceType === 'Others' ? d.customDeviceType : d.deviceType).join(', ')}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500 truncate" style={{ maxWidth: '200px' }}>
                  {handover.devices.map(d => d.serialNumber).join(', ')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1.5" />
                  {new Date(handover.submittedAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-4">
                  <button onClick={() => onViewAsset(handover)} className="text-gray-600 hover:text-gray-900">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(handover.id)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDeleteAsset(handover.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentHandoversTable;
