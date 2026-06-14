# FiberSave Product Decisions

This document records the Phase 1 decisions for the first FiberSave implementation.

## MVP Boundary

The first MVP is personal non-custodial savings.

Included:

- Wallet connection
- CKB testnet balance display
- Savings goal creation
- Goal progress tracking
- Deposit address view
- Withdrawal flow
- Activity history

Deferred:

- Fiber remittance
- Savings circles
- Yield features
- Credit scoring
- Merchant tools
- Employer payroll

## Wallet Model

The MVP connects to an existing wallet first. An embedded wallet can be considered later, but the first implementation should avoid owning recovery, key storage, and backup complexity.

## Network

The first implementation targets CKB testnet.

## Asset Scope

The first implementation should support CKB balance display. RGB++ stable assets are part of the product direction, but the exact integration API should remain behind a stable `balances` module until the implementation path is confirmed.

## Savings Goal Model

Savings goals are app-level metadata in the MVP. Assigning funds to a goal does not lock funds on-chain.

This keeps the first version practical while leaving room for later on-chain savings locks.

## Custody Boundary

FiberSave must remain non-custodial.

- The app must not store private keys.
- The backend must not be able to move funds.
- Transactions must be signed by the user's wallet.
- Metadata can be stored locally or server-side, but funds remain wallet-controlled.

## Metadata Storage

Start with a storage interface and local browser storage for the prototype. The implementation can later move to API routes and a database without changing the UI.

## Backend Scope

No backend is required for Phase 1 unless metadata persistence across devices becomes necessary. If added, the backend should only store metadata and indexing records.
