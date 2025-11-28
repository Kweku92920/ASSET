import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddAssetPage from './pages/AddAssetPage';
import PrintPage from './pages/PrintPage';
import {
  loginUser,
  getAssets,
  createAsset,
  updateAssetById,
  deleteAssetById,
  importAssetsBulk,
} from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setAssets([]);
      return;
    }

    let isMounted = true;

    const fetchAssetsFromServer = async () => {
      setIsLoadingAssets(true);
      try {
        const list = await getAssets();
        if (isMounted) {
          setAssets(list);
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error.message || 'Failed to load assets.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingAssets(false);
        }
      }
    };

    fetchAssetsFromServer();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleLogin = async ({ username, password }) => {
    const data = await loginUser({ username, password });
    setIsAuthenticated(true);
    setCurrentUser(data.user);
    toast.success(`Welcome, ${data.user.fullName}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSearchQuery('');
    setAssets([]);
  };

  const handleAddAsset = async (newAsset) => {
    try {
      const savedAsset = await createAsset(newAsset);
      setAssets((previousAssets) => [savedAsset, ...previousAssets]);
      toast.success('Asset handover submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to add asset.');
      throw error;
    }
  };

  const handleUpdateAsset = async (assetId, updatedData) => {
    try {
      const updatedAsset = await updateAssetById(assetId, updatedData);
      setAssets((previousAssets) =>
        previousAssets.map((asset) => (asset.id === assetId ? updatedAsset : asset))
      );
      toast.success('Asset handover updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update asset.');
      throw error;
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await deleteAssetById(assetId);
      setAssets((previousAssets) => previousAssets.filter((asset) => asset.id !== assetId));
      toast.warn('Asset record has been deleted.');
    } catch (error) {
      toast.error(error.message || 'Failed to delete asset.');
    }
  };

  const handleImportAssets = async (importedAssets) => {
    try {
      await importAssetsBulk(importedAssets);
      const latestAssets = await getAssets();
      setAssets(latestAssets);
      toast.success(`${importedAssets.length} asset(s) imported successfully!`);
    } catch (error) {
      toast.error(error.message || 'Failed to import assets.');
    }
  };

  const filteredAssets = [];
  const query = searchQuery.toLowerCase();

  for (let i = 0; i < assets.length; i++) {
    const asset = assets[i];

    if (!query) {
      filteredAssets.push(asset);
      continue;
    }

    const staffFullName = asset.staffDetails.fullName.toLowerCase();
    const staffId = asset.staffDetails.staffId.toLowerCase();
    const staffDept = asset.staffDetails.department.toLowerCase();

    let staffMatch = false;
    if (staffFullName.includes(query) || staffId.includes(query) || staffDept.includes(query)) {
      staffMatch = true;
    }

    let deviceMatch = false;
    for (let j = 0; j < asset.devices.length; j++) {
      const device = asset.devices[j];
      const typeMatch = device.deviceType.toLowerCase().includes(query);
      const brandMatch = device.brand.toLowerCase().includes(query);
      const modelMatch = device.model.toLowerCase().includes(query);
      const serialMatch = device.serialNumber.toLowerCase().includes(query);

      if (typeMatch || brandMatch || modelMatch || serialMatch) {
        deviceMatch = true;
        break; // No need to check other devices once we have a match
      }
    }

    if (staffMatch || deviceMatch) {
      filteredAssets.push(asset);
    }
  }

  // === ROUTES / UI STRUCTURE ===
  return (
    <BrowserRouter>
      <Routes>
        {/* Public login page. If already logged in, send the user to the dashboard. */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Print-only page. We guard it so only logged-in users can access it. */}
        <Route
          path="/print-asset/:assetId"
          element={
            isAuthenticated ? (
              <PrintPage assets={assets} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* All main application pages live inside the Layout component. */}
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
          {/* Dashboard (home) page which shows the list of handovers. */}
          <Route
            index
            element={
              <DashboardPage
                assets={filteredAssets}
                isLoading={isLoadingAssets}
                onDeleteAsset={handleDeleteAsset}
                onImportAssets={handleImportAssets}
              />
            }
          />

          {/* Page for creating a new handover. */}
          <Route
            path="add-asset"
            element={<AddAssetPage onAddAsset={handleAddAsset} />}
          />

          {/* Page for editing an existing handover. */}
          <Route
            path="edit-asset/:assetId"
            element={
              <AddAssetPage assets={assets} onUpdateAsset={handleUpdateAsset} />
            }
          />
        </Route>

        {/* Fallback route: send unknown URLs either to dashboard or login. */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? '/' : '/login'} replace />
          }
        />
      </Routes>

      {/* Toast notifications container (success / error messages). */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
