# Production Application Guide

This guide explains how to move this repository from the current demo/MVP state to a final production-ready decentralized identity application.

## 1. Target Production Scope

The final application should provide:

1. Real authentication and role-based access (student, university, employer).
2. Real DID registration on Ethereum Sepolia (or production network/L2 later).
3. Real credential issuance flow:
   - credential payload creation
   - IPFS pinning
   - on-chain issuance transaction
   - DB persistence
4. Real verification flow that works for users with and without MetaMask.
5. Secure deployment for frontend, backend, database, wallet keys, and secrets.

## 2. Current Gap Summary

Current repository state includes both demo and non-demo codepaths. Main blockers:

1. Frontend boots demo app (`AppDemo`) by default.
2. Backend `start/dev` scripts point to demo server by default.
3. University issuance in main frontend currently uses mock IPFS hash generation.
4. No complete admin UX/API flow for issuer onboarding (`addIssuer` in contract).
5. Verification in frontend assumes wallet provider access; must support RPC-only read mode.
6. Missing production hardening: validation, observability, test coverage, CI/CD, secret management.

## 3. Production Architecture (Recommended)

Use this responsibility split:

1. Frontend:
   - wallet connection for user identity/signing actions
   - form capture and display
   - verification UI
2. Backend:
   - auth, RBAC, input validation, audit logging
   - IPFS integration (Pinata)
   - blockchain read/write orchestration for server-initiated operations where required
3. Smart contract:
   - DID + credential registry
   - issuer authorization and revocation
4. MongoDB:
   - user profiles, issued credential metadata, revocation state snapshots
5. RPC and Indexing:
   - RPC for contract reads/writes
   - optional event indexing job for consistency checks

## 4. Phase-by-Phase Implementation Plan

## Phase 0: Environment and Safety Baseline (1-2 days)

1. Create separate `.env` files for root, `api`, and `client`.
2. Add required production env variables to docs:
   - MongoDB URI
   - JWT secret
   - RPC URL
   - contract address
   - Pinata keys
3. Rotate all demo/test credentials and use secret manager in production host.
4. Add startup validation (`fail fast`) for missing critical env vars.

Exit criteria:
1. Services fail clearly with explicit env error messages.
2. No secrets in repo history or tracked files.

## Phase 1: Switch Main App as Default Runtime (0.5-1 day)

1. Change frontend entry from `AppDemo` to `App`.
2. Update API scripts so:
   - `dev` runs `server.js` in non-demo mode
   - keep separate script for demo mode if needed
3. Add a visible environment banner in UI (`DEMO` vs `PROD`) to prevent confusion.

Exit criteria:
1. `npm run dev` starts main app path end-to-end.
2. Demo mode remains optional and explicit.

## Phase 2: Complete Real Credential Issuance Path (2-4 days)

1. Remove mock IPFS generation from frontend.
2. Move VC creation + IPFS pinning to backend service.
3. Backend should:
   - validate university role and wallet status
   - build verifiable credential object
   - upload to IPFS and capture CID
   - compute credential hash deterministically
   - write on-chain `issueCredential`
   - persist DB record only after confirmed tx
4. Add transaction status handling (`pending`, `confirmed`, `failed`) with retries.

Exit criteria:
1. Issued credentials have real tx hash + real IPFS CID.
2. DB and on-chain record match for each issued credential.

## Phase 3: DID and Issuer Administration Flows (2-3 days)

1. DID registration:
   - register from student wallet
   - persist DID in DB after tx confirmation
2. Issuer management:
   - add admin-only API/UI to call `addIssuer/removeIssuer`
   - store and display issuer authorization status

Exit criteria:
1. Non-authorized university cannot issue.
2. Admin can onboard/offboard issuers and reflect status in UI.

## Phase 4: Verification Hardening (1-2 days)

1. Support verification without MetaMask by using public RPC provider for reads.
2. Verification endpoint should aggregate:
   - on-chain validity
   - revocation status
   - expiry
   - optional IPFS metadata fetch
3. Improve error messages:
   - hash not found
   - network mismatch
   - RPC unavailable

Exit criteria:
1. Employer verifies using only hash/link from any browser.
2. Verification result is deterministic and auditable.

## Phase 5: Security, Validation, and Reliability (3-5 days)

1. Add request validation middleware (Joi/Zod/express-validator).
2. Add rate limiting + CORS hardening + helmet + secure headers.
3. Add audit log fields:
   - who issued/revoked
   - when
   - tx hash
4. Prevent duplicate issuance for same normalized credential payload unless explicitly allowed.
5. Add centralized error schema and correlation IDs.

Exit criteria:
1. Critical routes validated and protected.
2. Common abuse paths blocked.

## Phase 6: Testing and CI/CD (2-4 days)

1. Smart contract tests:
   - issuer auth
   - DID lifecycle
   - issue/revoke/verify edge cases
2. API tests:
   - auth + RBAC
   - issue/verify/revoke flows
3. Frontend tests:
   - role routing
   - credential issuance forms
   - verification rendering
4. CI pipeline:
   - lint
   - tests
   - build

Exit criteria:
1. CI green on pull requests.
2. Reproducible release candidate build.

## Phase 7: Deployment and Operations (2-3 days)

1. Deploy contract to Sepolia (or chosen network) and store verified address.
2. Deploy API and frontend separately.
3. Configure domain, HTTPS, CORS allowlist, and environment-based configs.
4. Add monitoring:
   - API health endpoint + uptime alerting
   - error tracking
   - RPC and DB latency checks
5. Add backup/restore plan for MongoDB.

Exit criteria:
1. Public URL works for full flow.
2. Alerts and logs available for incident response.

## 5. Recommended Timeline

1. Fast-track capstone production-ready demo: 5-10 working days.
2. Strongly stabilized release: 2-4 weeks.
3. Enterprise-grade hardening and operations: 6-10 weeks.

## 6. Definition of Done (Production)

The application is production-complete when all are true:

1. Main app (not demo) is default in runtime and deployment.
2. Students can register DID and receive credentials through real on-chain + IPFS flow.
3. Universities can issue and revoke credentials only when authorized issuer status is true.
4. Employers can verify credentials without wallet dependency.
5. Security controls and validation are in place and tested.
6. CI/CD, monitoring, and rollback/recovery procedures are documented and active.

## 7. Quick Command Checklist

Root:

```bash
npm install
npm run compile
npm run test
npm run deploy:sepolia
```

API:

```bash
cd api
npm install
npm run dev
```

Client:

```bash
cd client
npm install
npm run dev
```

## 8. Suggested First PR Sequence

1. PR-1: runtime switch from demo to main app + env validation.
2. PR-2: backend-controlled IPFS + issuance orchestration.
3. PR-3: issuer admin flow + DID lifecycle hardening.
4. PR-4: verification read-only RPC support.
5. PR-5: security middleware + validation + tests + CI.

