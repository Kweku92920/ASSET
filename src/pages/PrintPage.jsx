import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PrintableRequisition from '../components/PrintableRequisition';

function PrintPage({ assets }) {
  const { assetId } = useParams();
  const navigate = useNavigate();

  let assetToPrint = null;
  if (assets && assetId) {
    for (let i = 0; i < assets.length; i++) {
      if (assets[i].id === assetId) {
        assetToPrint = assets[i];
        break;
      }
    }
  }

  useEffect(() => {
    if (assetToPrint) {
      setTimeout(() => {
        window.print();
        // Optional: you could close the tab/window after printing with:
        // window.onafterprint = () => window.close();
      }, 500);
    }
  }, [assetToPrint]);

  if (!assetToPrint) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Asset Not Found</h1>
          <p className="text-gray-600 mt-2">
            The asset you are trying to print does not exist or is no longer available.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-brand-blue text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="print-container">
      <PrintableRequisition asset={assetToPrint} />
    </div>
  );
}

export default PrintPage;
