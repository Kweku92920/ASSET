import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import Asset from './models/Asset.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ADMIN_USER = {
  id: 'admin',
  username: 'admin',
  fullName: 'IT Administrator',
  staffId: 'EMP001',
  position: 'Administrator',
  department: 'IT',
  role: 'Admin',
};
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  if (username === ADMIN_USER.username && password === ADMIN_PASSWORD) {
    return res.json({ user: ADMIN_USER });
  }

  return res.status(401).json({ message: 'Invalid credentials.' });
});

app.get(
  '/api/assets',
  asyncHandler(async (_req, res) => {
    const assets = await Asset.find().sort({ submittedAt: -1, createdAt: -1 });
    res.json(assets);
  }),
);

app.get(
  '/api/assets/:assetId',
  asyncHandler(async (req, res) => {
    const asset = await Asset.findById(req.params.assetId);

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.json(asset);
  }),
);

function validateAssetPayload(payload) {
  if (!payload?.staffDetails) {
    return false;
  }

  if (!Array.isArray(payload?.devices) || payload.devices.length === 0) {
    return false;
  }

  if (!payload?.signatures?.staffSignature || !payload?.signatures?.adminSignature) {
    return false;
  }

  if (payload?.termsAccepted !== true) {
    return false;
  }

  return true;
}

function normalizeDevices(devices = []) {
  return devices.map((device) => ({
    ...device,
    id: device.id || uuidv4(),
  }));
}

app.post(
  '/api/assets',
  asyncHandler(async (req, res) => {
    const payload = req.body;

    if (!validateAssetPayload(payload)) {
      return res.status(400).json({ message: 'Invalid payload.' });
    }

    const asset = await Asset.create({
      ...payload,
      devices: normalizeDevices(payload.devices),
      submittedAt: payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
    });

    res.status(201).json(asset);
  }),
);

app.put(
  '/api/assets/:assetId',
  asyncHandler(async (req, res) => {
    const payload = req.body;

    if (!validateAssetPayload(payload)) {
      return res.status(400).json({ message: 'Invalid payload.' });
    }

    const update = {
      ...payload,
      devices: normalizeDevices(payload.devices),
    };

    if (payload.submittedAt) {
      update.submittedAt = new Date(payload.submittedAt);
    }

    const updatedAsset = await Asset.findByIdAndUpdate(req.params.assetId, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedAsset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.json(updatedAsset);
  }),
);

app.delete(
  '/api/assets/:assetId',
  asyncHandler(async (req, res) => {
    const deleted = await Asset.findByIdAndDelete(req.params.assetId);

    if (!deleted) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.status(204).end();
  }),
);

app.post(
  '/api/assets/import',
  asyncHandler(async (req, res) => {
    const { assets: importList } = req.body || {};

    if (!Array.isArray(importList) || importList.length === 0) {
      return res.status(400).json({ message: 'Assets array is required.' });
    }

    const normalized = importList.map((asset) => ({
      ...asset,
      devices: normalizeDevices(asset.devices),
      submittedAt: asset.submittedAt ? new Date(asset.submittedAt) : new Date(),
    }));

    const inserted = await Asset.insertMany(normalized, { ordered: false });

    res.status(201).json({ inserted: inserted.length });
  }),
);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal server error.';
  res.status(status).json({ message });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

