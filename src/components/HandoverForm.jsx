import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'react-toastify';
import { PlusCircle, Trash2, AlertTriangle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function HandoverForm({ onSubmit, assetToEdit, isEditMode }) {
  const [staffDetails, setStaffDetails] = useState({
    fullName: '',
    staffId: '',
    position: '',
    department: '',
    dateTime: '',
  });

  const [devices, setDevices] = useState([
    { id: uuidv4(), deviceType: '', customDeviceType: '', brand: '', model: '', serialNumber: '' }
  ]);

  // Simple department list with option to add more
  const [departments, setDepartments] = useState([
    'IT',
    'Finance',
    'HR',
    'Operations',
    'Administration',
  ]);

  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');

  const [termsAccepted, setTermsAccepted] = useState(false);
  const staffSigRef = useRef(null);
  const adminSigRef = useRef(null);

  useEffect(() => {
    if (isEditMode && assetToEdit) {
      setStaffDetails(assetToEdit.staffDetails);
      setDevices(assetToEdit.devices);
      setTermsAccepted(assetToEdit.termsAccepted);
      let existingDept = null;
      if (assetToEdit.staffDetails) {
        existingDept = assetToEdit.staffDetails.department;
      }
      if (existingDept) {
        setDepartments(prev =>
          prev.includes(existingDept) ? prev : [...prev, existingDept]
        );
      }
    } else {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });
      setStaffDetails(prev => ({ ...prev, dateTime: formattedDateTime }));
    }
  }, [assetToEdit, isEditMode]);

  const handleStaffInputChange = (e) => {
    const { name, value } = e.target;
    setStaffDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewDepartment = () => {
    const trimmed = newDepartment.trim();
    if (!trimmed) {
      return;
    }

    setDepartments(prev => {
      if (prev.includes(trimmed)) return prev;
      return [...prev, trimmed];
    });

    setStaffDetails(prev => ({ ...prev, department: trimmed }));
    setNewDepartment('');
    setIsAddingDepartment(false);
  };
  
  const handleDeviceChange = (id, e) => {
    const { name, value } = e.target;

    const updatedDevices = [...devices];

    for (let i = 0; i < updatedDevices.length; i++) {
      if (updatedDevices[i].id === id) {
        updatedDevices[i] = {
          ...updatedDevices[i],
          [name]: value,
        };
        break;
      }
    }

    setDevices(updatedDevices);
  };

  const addDevice = () => {
    setDevices([...devices, { id: uuidv4(), deviceType: '', customDeviceType: '', brand: '', model: '', serialNumber: '' }]);
  };

  const removeDevice = (id) => {
    if (devices.length > 1) {
      setDevices(devices.filter(device => device.id !== id));
    } else {
      toast.warn("You must have at least one device.");
    }
  };

  const clearSignatures = () => {
    staffSigRef.current.clear();
    adminSigRef.current.clear();
  };

  const resetForm = () => {
    setStaffDetails({
      fullName: '', staffId: '', position: '', department: '',
      dateTime: new Date().toLocaleString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      }),
    });
    setDevices([{ id: uuidv4(), deviceType: '', customDeviceType: '', brand: '', model: '', serialNumber: '' }]);
    setTermsAccepted(false);
    clearSignatures();
  };

  const isFormValid = () => {
    const staffFields = ['fullName', 'staffId', 'position', 'department'];
    for (let i = 0; i < staffFields.length; i++) {
      const field = staffFields[i];
      const value = staffDetails[field];
      if (!value || value.trim() === '') {
        return false;
      }
    }

    for (let i = 0; i < devices.length; i++) {
      const device = devices[i];

      if (
        device.deviceType === '' ||
        device.brand.trim() === '' ||
        device.model.trim() === '' ||
        device.serialNumber.trim() === ''
      ) {
        return false;
      }

      if (device.deviceType === 'Others' && device.customDeviceType.trim() === '') {
        return false;
      }
    }

    if (!termsAccepted) {
      return false;
    }

    if (staffSigRef.current.isEmpty() || adminSigRef.current.isEmpty()) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fill all required fields, including signatures.");
      return;
    }

    const submissionData = {
      staffDetails,
      devices: devices.map(d => ({
        ...d,
        deviceType: d.deviceType === 'Others' ? d.customDeviceType : d.deviceType
      })),
      termsAccepted,
      signatures: {
        staffSignature: staffSigRef.current.toDataURL(),
        adminSignature: adminSigRef.current.toDataURL()
      },
      submittedAt: isEditMode ? assetToEdit.submittedAt : new Date().toISOString()
    };

    try {
      await onSubmit(submissionData);
      if (!isEditMode) {
        resetForm();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit the asset handover.');
    }
  };

  const terms = [
    'Responsibility for proper care and maintenance of assigned device(s).',
    'Adherence to company security protocols and policies.',
    'Prompt reporting of any faults or damages.',
    'Compliance with data handling and privacy policies.',
    'Return of device(s) upon employment termination or as requested.'
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{isEditMode ? 'Edit Asset Handover' : 'Asset Handover Form'}</h1>
          <p className="text-gray-600">{isEditMode ? 'Update the details for this asset assignment.' : 'Complete all sections to process asset assignment.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Staff Details Section (kept simple and explicit) */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-brand-blue">Staff Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={staffDetails.fullName}
                  onChange={handleStaffInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              {/* Staff ID */}
              <div>
                <label htmlFor="staffId" className="block text-sm font-medium text-gray-700 mb-2">
                  Staff ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="staffId"
                  name="staffId"
                  value={staffDetails.staffId}
                  onChange={handleStaffInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter staff ID"
                  required
                />
              </div>

              {/* Position */}
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                  Position <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={staffDetails.position}
                  onChange={handleStaffInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200 outline-none bg-white"
                  required
                >
                  <option value="">Select position</option>
                  <option value="Junior Staff">Junior Staff</option>
                  <option value="Senior Staff">Senior Staff</option>
                </select>
              </div>

              {/* Department with dropdown and add-new option */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={staffDetails.department}
                  onChange={handleStaffInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200 outline-none bg-white"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setIsAddingDepartment(true)}
                  className="mt-2 text-sm text-brand-blue hover:underline"
                >
                  + Add another department
                </button>

                {isAddingDepartment && (
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none"
                      placeholder="Type new department"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNewDepartment}
                      className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-brand-blue-dark"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingDepartment(false);
                        setNewDepartment('');
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Date & Time (read-only) */}
              <div className="md:col-span-2">
                <label htmlFor="dateTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Date &amp; Time
                </label>
                <input
                  type="text"
                  id="dateTime"
                  name="dateTime"
                  value={staffDetails.dateTime}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Device Information Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-brand-blue">Device Information</h2>
            <div className="space-y-6">
              {devices.map((device, index) => (
                <div key={device.id} className="bg-brand-gray-100 p-4 rounded-lg relative animate-fade-in-up">
                  <h3 className="font-semibold text-brand-gray-700 mb-4">Device #{index + 1}</h3>
                  {devices.length > 1 && (
                    <button type="button" onClick={() => removeDevice(device.id)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Device Type <span className="text-red-500">*</span></label>
                      <select name="deviceType" value={device.deviceType} onChange={(e) => handleDeviceChange(device.id, e)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none bg-white" required>
                        <option value="">Select device type</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Keyboard">Keyboard</option>
                        <option value="Mouse">Mouse</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    {device.deviceType === 'Others' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Custom Device Type <span className="text-red-500">*</span></label>
                        <input type="text" name="customDeviceType" value={device.customDeviceType} onChange={(e) => handleDeviceChange(device.id, e)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Specify device" required />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Brand <span className="text-red-500">*</span></label>
                      <input type="text" name="brand" value={device.brand} onChange={(e) => handleDeviceChange(device.id, e)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Enter brand" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model <span className="text-red-500">*</span></label>
                      <input type="text" name="model" value={device.model} onChange={(e) => handleDeviceChange(device.id, e)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Enter model" required />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number <span className="text-red-500">*</span></label>
                      <input type="text" name="serialNumber" value={device.serialNumber} onChange={(e) => handleDeviceChange(device.id, e)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none" placeholder="Enter serial number" required />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={addDevice} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-blue bg-brand-blue-light hover:bg-blue-200 rounded-lg transition-colors">
              <PlusCircle size={18} />
              Add Another Device
            </button>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-brand-blue">Acceptance of Terms</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-start space-x-3 mb-4">
                <input type="checkbox" id="termsAccepted" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-5 h-5 text-brand-blue border-gray-300 rounded focus:ring-2 focus:ring-brand-blue cursor-pointer" required />
                <label htmlFor="termsAccepted" className="text-sm font-medium text-gray-900 cursor-pointer">I accept the terms and conditions <span className="text-red-500">*</span></label>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 ml-8">{terms.map((term, index) => <li key={index} className="flex items-start"><span className="text-brand-blue mr-2">•</span><span>{term}</span></li>)}</ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-brand-blue">Signatures</h2>
            {isEditMode && (
              <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg flex items-center gap-3">
                <AlertTriangle size={20} />
                <p className="text-sm font-medium">For compliance, signatures must be re-submitted when editing a record.</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Signature <span className="text-red-500">*</span></label>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white"><SignatureCanvas ref={staffSigRef} canvasProps={{ className: 'w-full h-40 cursor-crosshair' }} /></div>
                <button type="button" onClick={() => staffSigRef.current.clear()} className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Clear</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Signature <span className="text-red-500">*</span></label>
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white"><SignatureCanvas ref={adminSigRef} canvasProps={{ className: 'w-full h-40 cursor-crosshair' }} /></div>
                <button type="button" onClick={() => adminSigRef.current.clear()} className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg">Clear</button>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button type="submit" className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 bg-brand-blue hover:bg-brand-blue-dark shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none">
              {isEditMode ? 'Save Changes' : 'Submit Handover Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HandoverForm;
