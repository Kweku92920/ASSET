import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HandoverForm from '../components/HandoverForm';
import { toast } from 'react-toastify';

function AddAssetPage({ assets, onAddAsset, onUpdateAsset }) {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!assetId;

  let assetToEdit = null;
  if (isEditMode && assets) {
    for (let i = 0; i < assets.length; i++) {
      if (assets[i].id === assetId) {
        assetToEdit = assets[i];
        break;
      }
    }
  }

  async function handleSubmit(assetData) {
    try {
      if (isEditMode) {
        if (onUpdateAsset) {
          await onUpdateAsset(assetId, assetData);
          navigate('/');
        }
      } else if (onAddAsset) {
        await onAddAsset(assetData);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong while saving the asset.');
    }
  }

  if (isEditMode && !assetToEdit) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Asset not found</h1>
        <p className="text-gray-600 mt-2">The asset you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <HandoverForm 
        onSubmit={handleSubmit} 
        assetToEdit={assetToEdit} 
        isEditMode={isEditMode} 
      />
    </div>
  );
}

export default AddAssetPage;
