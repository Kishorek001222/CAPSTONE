# Main App Quickstart (Non-Demo)

This runbook starts the real application path, not the demo path.

## 1. Configure Environment

Create and populate these files:

1. Root: `.env` from `.env.production.example`
2. API: `api/.env` from `api/.env.production.example`
3. Client: `client/.env` from `client/.env.example`

Minimum required values for backend startup:

1. `MONGODB_URI`
2. `JWT_SECRET`

Recommended for full functionality:

1. `SEPOLIA_RPC_URL` (or `RPC_URL`)
2. `CONTRACT_ADDRESS`
3. `PINATA_API_KEY`
4. `PINATA_SECRET_KEY`

## 2. Install Dependencies

```bash
npm install
cd api && npm install
cd ../client && npm install
```

## 3. Compile and Deploy Contract

From repository root:

```bash
npm run compile
npm run deploy:sepolia
```

This writes ABI/address artifacts used by API and client.

## 4. Run Backend (Main Mode)

```bash
cd api
npm run dev
```

Main-mode scripts:

1. `npm run dev` -> main API server
2. `npm run start` -> main API server
3. `npm run dev:demo` -> demo API server (optional)

## 5. Run Frontend (Main Mode)

In `client/.env` ensure:

1. `VITE_DEMO_MODE=false`
2. `VITE_API_URL=http://localhost:5000`
3. `VITE_CONTRACT_ADDRESS=...`
4. `VITE_RPC_URL=...`

Then run:

```bash
cd client
npm run dev
```

## 6. Smoke Test Checklist

1. Signup as `student`, `university`, `employer`.
2. Connect wallet in student/university dashboards.
3. Register DID as student.
4. Issue credential as university.
5. Verify credential as employer using hash.
6. Confirm transaction link and verification view render correctly.

## 7. Troubleshooting

1. `Missing required environment variables`: check API `.env`.
2. `Contract address is missing`: set `VITE_CONTRACT_ADDRESS`.
3. `Unable to verify credential from blockchain RPC`: verify `VITE_RPC_URL` and network availability.
4. Issuance warning about integrations: backend detected partial config (blockchain/ipfs not fully set).
