import React, { useState, useRef } from 'react';
import { FileDown, FileUp, Printer } from 'lucide-react';
import { toast } from 'react-toastify';
import Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import RecentHandoversTable from '../components/RecentHandoversTable';
import AssetViewModal from '../components/AssetViewModal';


/**
 * The main dashboard page.
 * Displays asset statistics and a table of recent handovers.
 */

function DashboardPage({ assets, onDeleteAsset, onImportAssets }) {
  const fileInputRef = useRef(null);
  const [viewingAsset, setViewingAsset] = useState(null);

 /**
   * Handles exporting the asset data to a CSV file.
   */

  const handleExport = () => {
    if (assets.length === 0) {
      toast.info("No assets to export.");
      return;
    }
   // Flatten the data so each device has its own row in the CSV
    const flattenedData = assets.flatMap(handover => 
      handover.devices.map(device => ({
        HandoverID: handover.id,
        StaffName: handover.staffDetails.fullName,
        StaffID: handover.staffDetails.staffId,
        StaffPosition: handover.staffDetails.position,
        StaffDepartment: handover.staffDetails.department,
        HandoverDate: handover.submittedAt,
        DeviceType: device.deviceType,
        Brand: device.brand,
        Model: device.model,
        SerialNumber: device.serialNumber,
      }))
    );

    const csv = Papa.unparse(flattenedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'asset_handovers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Assets exported successfully!");
  };


 /**
   * Triggers the file input dialog.
   */
  const handleImportClick = () => {
    fileInputRef.current.click();
  };
/**
   * Handles the file import process when a user selects a file.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // This object will temporarily store handovers by their ID to group devices. 
          const groupedByHandover = results.data.reduce((acc, row) => {
            const handoverId = row.HandoverID || uuidv4();
            if (!acc[handoverId]) {
              acc[handoverId] = {
                id: handoverId,
                staffDetails: {
                  fullName: row.StaffName,
                  staffId: row.StaffID,
                  position: row.StaffPosition,
                  department: row.StaffDepartment,
                  dateTime: new Date(row.HandoverDate).toLocaleString('en-US'),
                },
                devices: [],
                termsAccepted: true,
                signatures: { staffSignature: '', adminSignature: '' },
                submittedAt: row.HandoverDate,
              };
            }
            acc[handoverId].devices.push({
              id: uuidv4(),
              deviceType: row.DeviceType,
              brand: row.Brand,
              model: row.Model,
              serialNumber: row.SerialNumber,
            });
            return acc;
          }, {});

          const importedAssets = Object.values(groupedByHandover);
          onImportAssets(importedAssets);
        } catch (error) {
          toast.error("Failed to process CSV. Please check the file format.");
          console.error("Import error:", error);
        }
      },
      error: (error) => {
        toast.error("Failed to parse CSV file.");
        console.error("CSV parsing error:", error);
      }
    });
    event.target.value = null;
  };

  const handlePrintAll = () => {
    toast.info("Printing all records is not supported. Please print individual records from the 'View' modal.");
  };

  return (
    <>
      <div className="animate-fade-in-up space-y-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-brand-gray-900 mb-1">Asset Dashboard</h1>
              <p className="text-brand-gray-600">Manage all asset handovers from here.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv"
                onChange={handleFileImport}
              />
              <button onClick={handleImportClick} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-gray-700 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg transition-colors">
                <FileUp size={16} />
                Import
              </button>
              <button onClick={handleExport} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-gray-700 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg transition-colors">
                <FileDown size={16} />
                Export
              </button>
               <button onClick={handlePrintAll} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-brand-gray-700 bg-brand-gray-100 hover:bg-brand-gray-200 rounded-lg transition-colors">
                <Printer size={16} />
                Print
              </button>
            </div>
          </div>
          <RecentHandoversTable 
            assets={assets} 
            onDeleteAsset={onDeleteAsset} 
            onViewAsset={(asset) => setViewingAsset(asset)}
          />
        </div>
      </div>
      <AssetViewModal 
        asset={viewingAsset}
        isOpen={!!viewingAsset}
        onClose={() => setViewingAsset(null)}
      />
    </>
  );
}

export default DashboardPage;
