# FiberSave Architecture

FiberSave is structured as a mobile-first web application with a non-custodial wallet boundary. The frontend owns the user experience, wallet connectors own signing, and metadata storage tracks savings goals and activity.

## Layers

```text
Frontend
  - Dashboard
  - Savings goals
  - Deposit and withdrawal screens
  - Activity history
  - Settings

Wallet Layer
  - Wallet connection
  - Address lookup
  - Transaction signing
  - Network selection

Metadata Layer
  - Savings goals
  - Goal assignments
  - Activity records
  - User preferences

CKB Layer
  - Balance discovery
  - Transaction construction
  - Transaction broadcast
  - Explorer references

Future Fiber Layer
  - Payment requests
  - Payment route status
  - Instant remittance
```

## Phase 1 Implementation Shape

The frontend is a Next.js application in `frontend/`.

Important folders:

- `frontend/src/app`: routes and layouts
- `frontend/src/components`: reusable UI components
- `frontend/src/lib`: wallet, storage, formatting, and blockchain helpers
- `frontend/src/types`: shared TypeScript contracts

## Non-Custodial Boundary

FiberSave can read balances and store user metadata, but it must not control funds.

All fund movement must use wallet signing. Any future backend must be unable to withdraw, transfer, or lock user funds by itself.

## Metadata Strategy

The first implementation should use interfaces for goal and activity storage. Local storage is acceptable for the first prototype. A backend can later replace the storage implementation without changing page-level code.

## Future Architecture Additions

Fiber remittance should be added through a server-side Fiber RPC wrapper so node URLs and credentials are not exposed in browser code.

Savings circles should begin as app-tracked metadata and only move to script-enforced state after contribution, payout, missed-payment, and dispute rules are finalized.
