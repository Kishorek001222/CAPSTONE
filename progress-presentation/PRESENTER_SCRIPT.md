# Presenter Script - Capstone Progress Review

Use this as a speaking guide with the web slides in `progress-presentation/index.html`.

Goal of this script:

1. Explain the project clearly to evaluators.
2. Show concrete progress from previous version to current version.
3. Make pending work explicit and approvable.

No greeting/formality lines are included. Start directly from Slide 1.

---

## Slide 1 - Project Title and Objective

What to say:

"This project is a decentralized identity and credential verification platform for academic use cases.  
The core idea is Self-Sovereign Identity: students own their identity representation, universities issue credentials, and employers verify them without relying on manual back-and-forth verification.  
Today I am presenting progress made so far, what changed from the previous version to the current version, and what is pending before final completion."

Key point to emphasize:

1. This is a **progress review**, not final delivery.

---

## Slide 2 - Components

What to say:

"The system has four main components.  
Frontend is React with role-based dashboards for student, university, and employer.  
Backend is Node/Express handling auth, credential APIs, and integration orchestration.  
Blockchain layer uses an Ethereum smart contract to store immutable credential status and DID-linked data.  
Data/storage layer combines MongoDB for application metadata and IPFS for credential documents."

Add this clarification:

"This hybrid model gives us both trustless verification and practical app performance."

Key point to emphasize:

1. Clear separation of concerns across UI, API, chain, and storage.

---

## Slide 3 - Design and Architecture

What to say:

"Architecturally, React client calls the Express API for app logic and persistence workflows.  
Credential verification and status trust are anchored to the Ethereum contract.  
Full credential payloads are stored off-chain in IPFS to control blockchain cost and improve scalability.  
MongoDB stores operational application data such as users and credential metadata for fast retrieval."

Then explain flow briefly:

"University creates credential payload -> backend normalizes and hashes data -> metadata is pinned to IPFS -> blockchain stores issued status and references -> employer verifies via hash and contract state."

Key point to emphasize:

1. On-chain for truth, off-chain for size and performance.

---

## Slide 4 - Prototype Development

What to say:

"Prototype development progressed in phases.  
Baseline version was demo-first with in-memory data and mock interactions.  
Current version is aligned toward production path: main runtime is default, environment and readiness checks are added, and issuance logic is being centralized in backend orchestration."

Use the timeline:

"M1 introduced role dashboards and demo APIs.  
M2 added smart contract behavior and test scaffolding.  
M3 shifted runtime defaults to main path and added env validation.  
M4 improved integration visibility and issuance refinements."

Key point to emphasize:

1. Progress is structured and incremental, not ad-hoc.

---

## Slide 5 - Phase 1 Testing

What to say:

"Phase 1 testing focused on correctness of core behavior rather than final-scale deployment.  
Smart contract behavior was tested for issuer management, DID registration, issue/revoke/verify credential flows.  
Frontend and backend route behavior was tested for role access and runtime mode logic.  
Health and integration readiness checks were verified."

Explain matrix outcome:

"Most critical functional checks are passing for progress-stage evaluation.  
Full end-to-end testing with real production credentials is pending final infrastructure keys."

Key point to emphasize:

1. Core logic is validated; infra-bound validation is pending.

---

## Slide 6 - Debugging and Refinements

What to say:

"A major part of this phase was debugging architecture-level issues, not just UI bugs.  
We resolved main/demo mode ambiguity by making main runtime default and demo explicit.  
We improved verification reliability by adding RPC read-only fallback instead of requiring wallet-only reads.  
We reduced inconsistency by removing client-side mock IPFS behavior from main issuance path and moving control toward backend orchestration.  
We added environment templates and startup checks to reduce configuration errors."

Debugging log explanation:

"Each fix was tied to a root cause and addressed systematically to improve stability."

Key point to emphasize:

1. Debugging improved system reliability and evaluability.

---

## Slide 7 - Previous Version vs Latest Version

What to say:

"This slide summarizes the delta.  
Previous version was demo-first, had wallet-dependent verification reads, and lacked explicit integration status visibility.  
Latest version is main-first, supports RPC fallback for verification, improves backend-led issuance behavior, and exposes integration readiness through API and UI warnings."

Then add:

"This transition moves the project from MVP demonstration to production completion track."

Key point to emphasize:

1. This is not a cosmetic update; it is a structural maturity improvement.

---

## Slide 8 - Pending Work and Approval Request

What to say:

"Pending critical work is focused and clearly scoped:  
one, final real environment wiring for MongoDB, RPC, contract, and Pinata;  
two, issuer administration lifecycle completion for add/remove issuer governance;  
three, security hardening and request validation across APIs;  
four, integration tests and CI quality gates before final deployment readiness."

Approval request wording:

"I request approval to proceed with this final completion sprint under the same architecture direction, because the core platform behavior and progression are validated and the remaining items are implementation-hardening tasks."

Close with this line:

"Current status is functionally advanced, and with approval, the project can move into final stabilization and completion."

---

## Optional Q&A Prep (Use If Asked)

### Q1: Why use both MongoDB and blockchain?
"Blockchain stores trust-critical immutable status. MongoDB stores operational app data for speed and usability."

### Q2: Can this work without MongoDB?
"Yes, but with tradeoffs. We can run wallet + chain + IPFS only, but querying/history and app ergonomics become harder."

### Q3: What is the biggest pending risk?
"Integration completeness and consistency under real credentials, especially around issuer governance and end-to-end hardening."

### Q4: What proves this is beyond demo stage?
"Main runtime default shift, backend issuance improvements, environment/integration checks, and production-oriented change tracking."

---

## Delivery Tips (Practical)

1. Spend about 60-90 seconds per slide.
2. For Slides 5 and 6, emphasize engineering rigor (testing + debugging).
3. For Slide 8, be explicit about what approval is needed and why it is safe to proceed.
4. Keep wording technical and direct.

