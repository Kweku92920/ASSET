import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddAssetPage from './pages/AddAssetPage';
import PrintPage from './pages/PrintPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    toast.success(`Welcome, ${user.fullName}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSearchQuery('');
  };

  const handleAddAsset = (newAsset) => {
    const assetWithId = { ...newAsset, id: uuidv4() };
    setAssets(prevAssets => [assetWithId, ...prevAssets]);
    toast.success("Asset handover submitted successfully!");
  };
  
  const handleUpdateAsset = (assetId, updatedData) => {
    const updatedAsset = { ...updatedData, id: assetId };
    setAssets(prevAssets => prevAssets.map(asset => asset.id === assetId ? updatedAsset : asset));
    toast.success("Asset handover updated successfully!");
  };

  const handleDeleteAsset = (assetId) => {
    setAssets(prevAssets => prevAssets.filter(asset => asset.id !== assetId));
    toast.warn("Asset record has been deleted.");
  };

  const handleImportAssets = (importedAssets) => {
    const newAssetsWithIds = importedAssets.map(asset => ({ ...asset, id: uuidv4() }));
    setAssets(prevAssets => [...prevAssets, ...newAssetsWithIds]);
    toast.success(`${importedAssets.length} asset(s) imported successfully!`);
  };

  const filteredAssets = assets.filter(asset => {
    const query = searchQuery.toLowerCase();
    if (!query) return true;

    const staffMatch = 
      asset.staffDetails.fullName.toLowerCase().includes(query) ||
      asset.staffDetails.staffId.toLowerCase().includes(query) ||
      asset.staffDetails.department.toLowerCase().includes(query);

    const deviceMatch = asset.devices.some(device =>
      (device.deviceType.toLowerCase().includes(query)) ||
      (device.brand.toLowerCase().includes(query)) ||
      (device.model.toLowerCase().includes(query)) ||
      (device.serialNumber.toLowerCase().includes(query))
    );
    
    return staffMatch || deviceMatch;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />} />
        
        <Route path="/print-asset/:assetId" element={isAuthenticated ? <PrintPage assets={assets} /> : <Navigate to="/print" />} />

        <Route 
          element={
            isAuthenticated ? (
              <Layout 
                onLogout={handleLogout} 
                currentUser={currentUser} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<DashboardPage assets={filteredAssets} onDeleteAsset={handleDeleteAsset} onImportAssets={handleImportAssets} />} />
          <Route path="add-asset" element={<AddAssetPage onAddAsset={handleAddAsset} />} />
          <Route path="edit-asset/:assetId" element={<AddAssetPage assets={assets} onUpdateAsset={handleUpdateAsset} />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} theme="colored" />
    </BrowserRouter>
  );
}

export default App;
