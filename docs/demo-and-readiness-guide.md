# FiberSave Demo and Readiness Guide

## Purpose

This document explains how to prepare, run, and present the current FiberSave
implementation. It also defines what is complete, what still needs to be built,
and whether the application is ready for a demo or production use.

## Current Readiness Summary

| Area | Status | Notes |
|------|--------|-------|
| Local product demo | Ready | Automated desktop and mobile flows pass |
| CKB testnet demo | Conditionally ready | Requires a funded wallet and a successful manual rehearsal |
| Fiber remittance demo | Mock ready | Live Fiber settlement requires configured nodes, channels, and liquidity |
| Funding presentation | Ready | Product scope, implementation phases, and demo narrative are documented |
| Public testnet deployment | Nearly ready | Deploy after completing the manual checklist on the selected wallet |
| Mainnet production | Not ready | Security, persistence, monitoring, indexing, and operational work remain |
| Real customer funds | Not approved | The current implementation must be treated as an MVP |

### Direct Assessment

FiberSave is **demo-ready for a controlled MVP presentation**.

Before presenting live CKB transactions, the presenter must complete the
funded-wallet checklist in
[`manual-testnet-checklist.md`](./manual-testnet-checklist.md).

FiberSave is **not production-ready for real users or mainnet funds**. The app
currently stores goals, preferences, deposit snapshots, and activity records in
browser local storage. It has not received an independent security review, and
its operational monitoring and recovery procedures are not yet defined.

## What the Current Implementation Demonstrates

The MVP demonstrates:

- CCC-compatible wallet connection
- Live native CKB testnet balance display
- Non-custodial ownership and wallet-controlled signing
- Savings goal creation and progress tracking
- Validation that goal assignments do not exceed wallet balance
- Wallet deposit address and QR code
- Balance-delta deposit detection
- Native CKB withdrawal construction and broadcast
- Fiber payment request generation in mock mode
- Fiber invoice submission and remittance activity tracking in mock mode
- Pending, completed, and failed transaction states
- CKB Explorer transaction links
- Local wallet activity history
- Responsive desktop and mobile layouts
- Automated unit and browser test coverage

The MVP does not yet demonstrate:

- Live Fiber Network settlement
- RGB++ stable-asset transfers
- BTC transfers
- Cross-device metadata synchronization
- Savings circles
- On-chain savings locks
- Fiat exchange-rate conversion
- Mainnet deployment

## Demo Modes

### Mode A: Live CKB Testnet Demo

Use this for technical reviewers and ecosystem funding presentations.

Requirements:

- A supported CCC wallet
- A funded CKB testnet account
- A second valid CKB testnet recipient address
- Stable internet access
- CKB testnet RPC and indexer availability
- CKB Explorer open in another tab

This mode demonstrates real wallet signing and testnet transaction broadcast.

### Mode B: Deterministic Product Demo

Use this when wallet connectivity, testnet availability, or presentation timing
is uncertain.

The automated Playwright environment provides an opt-in demo wallet with a
fixed balance. It is intended for local demonstrations and tests only.

Set:

```text
NEXT_PUBLIC_ENABLE_DEMO_MODE=true
```

Do not enable demo mode in a public or production deployment.

Demo mode supports the savings goal and interface workflow but does not replace
a live wallet-signed withdrawal demonstration.

## Local Setup

From `ckb-fiber-save/frontend`:

```bash
pnpm install
```

Create `.env.local` from `.env.example`:

```text
NEXT_PUBLIC_CKB_NETWORK=testnet
NEXT_PUBLIC_CKB_RPC_URL=https://testnet.ckb.dev/rpc
NEXT_PUBLIC_CKB_INDEXER_URL=https://testnet.ckb.dev/indexer
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

Start the application:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Pre-Demo Verification

Run the complete automated verification:

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

Expected result:

- ESLint passes
- 10 unit tests pass
- 10 Playwright desktop/mobile flows pass
- Next.js production build completes

Then complete the manual testnet checklist:

[`manual-testnet-checklist.md`](./manual-testnet-checklist.md)

Do not rely on a live transaction during the presentation until the exact
wallet, recipient, and network path have been rehearsed.

## Recommended Live Demo Flow

### 1. Introduce the Product

Open the dashboard and explain:

- FiberSave is non-custodial.
- The wallet controls keys and transaction approval.
- The current milestone focuses on personal savings.
- Fiber remittance is the next implementation phase.

### 2. Connect the Wallet

Connect a funded CKB testnet wallet.

Show:

- Truncated connected identity
- Copy-address control
- Live balance rounded to two decimal places
- Network status

### 3. Create a Savings Goal

Open **Goals** and create:

```text
Name: School Fees
Asset: CKB
Target: Choose a value below the available wallet balance
```

Explain that a goal assignment is planning metadata. It does not lock or move
wallet funds.

### 4. Assign Funds

Assign part of the available balance to the goal.

Show:

- Updated progress
- Available wallet balance
- Validation when an assignment exceeds available funds
- Goal progress on the main dashboard

### 5. Show Activity

Open **Activity** and point out:

- Goal creation record
- Goal assignment record
- Status labels
- Wallet-specific local activity

### 6. Demonstrate Deposit

Open **Deposit**.

Show:

- QR code
- Truncated address
- Copy-address button
- Supported asset balances

If time and testnet conditions allow, send CKB into the wallet and refresh the
balance to demonstrate deposit detection.

### 7. Demonstrate Withdrawal

Open **Withdraw**.

Use a valid testnet recipient and an amount above the CKB occupied-capacity
minimum while leaving enough CKB for fees.

Show:

- Address validation
- Wallet approval
- Transaction broadcast
- Pending activity
- Explorer link
- Completed activity after confirmation

### 8. Close with the Roadmap

Explain that the current MVP proves the personal savings foundation and now
includes a mock-safe Fiber remittance interface. The next funded milestone is
live Fiber node rehearsal with channels, liquidity, and payment-state tracking
against a configured node.

The shorter presentation version is available in
[`demo-script.md`](./demo-script.md).

## Demo Failure Plan

Live blockchain demonstrations can fail because of wallet, RPC, indexer,
network, or transaction-confirmation delays.

Prepare the following:

- A tested demo wallet already connected to testnet
- A known valid recipient address
- A small but sufficient CKB balance
- A previously completed Explorer transaction as evidence
- Screenshots or a recording of the successful withdrawal flow
- Demo mode for the product workflow
- The manual checklist with the most recent rehearsal date

If a live transaction stalls:

1. Show that the transaction was broadcast.
2. Open the Explorer link.
3. Explain the pending state.
4. Continue to the roadmap instead of waiting indefinitely.

## Deployment for a Public Testnet Demo

A Vercel deployment can host the frontend because blockchain operations are
performed through the connected wallet and public testnet services.

Required environment variables:

```text
NEXT_PUBLIC_CKB_NETWORK=testnet
NEXT_PUBLIC_CKB_RPC_URL=https://testnet.ckb.dev/rpc
NEXT_PUBLIC_CKB_INDEXER_URL=https://testnet.ckb.dev/indexer
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
```

Before sharing the deployment:

- Run all automated checks
- Complete the manual wallet checklist
- Verify wallet connectors in the deployed domain
- Verify the Explorer link uses testnet
- Verify mobile layout on a physical device
- Clear old local metadata
- Confirm demo mode is disabled

## Production Readiness Assessment

### Ready Enough for a Demo

The following are strong enough for an MVP demo:

- Responsive interface
- Wallet connection boundary
- CKB balance query
- Savings-goal workflow
- Input validation
- Testnet withdrawal construction
- Transaction status handling
- Explorer integration
- Automated unit and browser tests

### Not Ready for Production

The following block production use:

#### 1. Browser-Local Persistence

Goals, activity, preferences, and deposit snapshots are stored in local
storage. Data does not follow the user across devices and can be cleared by the
browser.

Required production work:

- Authenticated metadata service
- Wallet-signature-based identity
- Database persistence
- Backup and migration strategy
- Explicit privacy and retention policy

#### 2. Deposit Detection

Deposit detection compares balance snapshots. It does not index individual
transactions and may misclassify aggregate balance changes.

Required production work:

- Transaction or cell indexer integration
- Unique deposit event identification
- Confirmation-depth policy
- Reorganization handling

#### 3. Security Review

No independent review has been completed.

Required production work:

- Wallet and transaction security review
- Dependency audit
- Threat model
- Abuse and phishing review
- Content Security Policy
- Rate limiting for future APIs
- Incident response plan

#### 4. Operational Reliability

The current app depends on public testnet endpoints without production
monitoring.

Required production work:

- RPC/indexer health checks
- Fallback endpoints
- Error monitoring
- Structured logging
- Performance monitoring
- Availability targets

#### 5. Asset Scope

RGB++ and BTC are placeholders. They must not be presented as active assets.

Required production work:

- Select the first RGB++ stable asset
- Integrate the supported SDK/API
- Add asset-specific validation
- Add token metadata and decimal handling
- Add asset transaction tests

#### 6. Product and Regulatory Review

Savings and remittance products may create legal, compliance, disclosure, and
consumer-protection requirements depending on the target market.

Required production work:

- Jurisdiction review
- User disclosures
- Terms and privacy policy
- Asset-risk disclosures
- Clear statement that goals are not locked funds

## What to Build Next

### Immediate: Demo Hardening

1. Complete and date the funded-wallet manual checklist.
2. Record one successful end-to-end testnet withdrawal.
3. Deploy the frontend to a stable public testnet URL.
4. Verify at least two supported wallet connectors.
5. Add error monitoring to the deployed frontend.
6. Add a visible testnet indicator on every transaction screen.

### Immediate Product Milestone: Live Phase 6 Fiber Rehearsal

Validate:

- Fiber node setup
- Channel setup and route liquidity
- Server-side Fiber RPC credentials
- Payment request generation against a live node
- Send-payment flow against a live node
- Receive-payment QR code scanning
- Invoice expiry
- Pending, paid, expired, and failed states
- Remittance activity history
- Channel and liquidity documentation

### Following Milestone: Phase 7 Savings Circles

Before coding, decide:

- Whether rules are app-tracked or script-enforced
- Contribution frequency
- Missed-contribution behavior
- Payout ordering
- Member visibility
- Exit and dispute rules

Then implement:

- Circle creation
- Invitations
- Contribution tracking
- Payout schedule
- Circle activity history

### Production Track

In parallel with product milestones:

1. Replace local storage with signed, authenticated metadata persistence.
2. Replace balance-delta deposit detection with indexed transaction events.
3. Add security, dependency, and threat-model reviews.
4. Add production observability and RPC fallback.
5. Add legal and product-risk disclosures.
6. Run a closed testnet beta before considering mainnet.

## Go/No-Go Checklist

### Go for Controlled Demo

- [ ] Automated checks pass
- [ ] Manual wallet checklist passes
- [ ] Wallet has sufficient testnet CKB
- [ ] Recipient address is verified
- [ ] Demo mode is disabled for live wallet demo
- [ ] Explorer is available
- [ ] Backup recording/screenshots are ready

### No-Go for Production

Do not market or operate the current build as production-ready until:

- [ ] Persistent authenticated storage exists
- [ ] Deposit indexing is transaction-based
- [ ] Security review is complete
- [ ] Monitoring and incident procedures exist
- [ ] Active assets are fully integrated and tested
- [ ] Legal and user-risk disclosures are approved
- [ ] Closed beta results are reviewed

## Final Conclusion

The current FiberSave implementation is a credible, testable, and visually
complete **CKB testnet MVP**. It is appropriate for a controlled demo, funding
review, ecosystem presentation, or closed technical evaluation.

It is not yet appropriate for mainnet deployment or handling real customer
savings. The safest next step is to harden and deploy the testnet demo, complete
Phase 6 Fiber remittance, and build the production persistence and security
track in parallel.
