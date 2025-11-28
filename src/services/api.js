const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function apiRequest(endpoint, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch {
    throw new Error('Unable to connect to the server. Please make sure the backend is running.');
  }

  if (!response.ok) {
    let errorMessage = 'Request failed.';
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Ignore JSON parse errors and use default message
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function loginUser(credentials) {
  return apiRequest('/login', { method: 'POST', body: credentials });
}

export function getAssets() {
  return apiRequest('/assets');
}

export function createAsset(payload) {
  return apiRequest('/assets', { method: 'POST', body: payload });
}

export function updateAssetById(assetId, payload) {
  return apiRequest(`/assets/${assetId}`, { method: 'PUT', body: payload });
}

export function deleteAssetById(assetId) {
  return apiRequest(`/assets/${assetId}`, { method: 'DELETE' });
}

export function importAssetsBulk(assets) {
  return apiRequest('/assets/import', { method: 'POST', body: { assets } });
}

