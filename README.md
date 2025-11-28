# IT Inventory Handover System

React (Vite) front-end + Express/MongoDB API for managing IT asset handovers.

## Requirements

- Node.js 18+
- npm 10+
- MongoDB 6+ (Atlas or local). The default connection string targets `mongodb://127.0.0.1:27017/pentasset`.

## Environment variables

1. Copy `env.example` to `.env` in the project root.
2. Update the values as needed:

```
VITE_API_URL=http://localhost:4000/api
ADMIN_PASSWORD=admin123
MONGODB_URI=mongodb://127.0.0.1:27017/pentasset
```

`MONGODB_URI` can point to any MongoDB deployment (local, Docker, Atlas). For Atlas, use the SRV string provided by the cluster (e.g. `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/pentasset`).

## Install & run

```bash
npm install

# Start the Express API (uses MONGODB_URI)
npm run server

# In another terminal, start the Vite dev server
npm run dev

# Or run both together
npm run dev:fullstack
```

The React app is served at `http://localhost:5173` by default and proxies API calls to `http://localhost:4000/api`.

## API endpoints

- `GET /api/health` – health check
- `POST /api/login` – admin login (`admin` / `ADMIN_PASSWORD`)
- `GET /api/assets` – list assets (sorted by submission date)
- `GET /api/assets/:assetId` – fetch a single asset
- `POST /api/assets` – create an asset handover record
- `PUT /api/assets/:assetId` – update an existing record
- `DELETE /api/assets/:assetId` – delete a record
- `POST /api/assets/import` – bulk import (array of asset documents)

All asset payloads must include `staffDetails`, at least one `device`, both signatures, and `termsAccepted: true`.
