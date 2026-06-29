# FiberSave Frontend

FiberSave is a non-custodial CKB testnet savings MVP. Wallet connectors control
signing and funds; the application stores savings goals, activity records, and
preferences locally in the browser.

## Current Capabilities

- Connect a CCC-compatible wallet and read its CKB testnet balance.
- Create savings goals and assign available wallet balance as metadata.
- Display a deposit address and QR code.
- Detect CKB balance increases while the deposit page is open or refreshed.
- Build, sign, and broadcast native CKB withdrawals through the connected wallet.
- Reconcile pending withdrawal activity against the CKB node.
- Link broadcast transactions to the CKB testnet explorer.
- Persist display currency preferences and clear local metadata.
- Show active goal progress on the dashboard.
- Reject goal assignments that exceed the available wallet balance.
- Run unit tests for goals, activity, and balance helpers.
- Run desktop and mobile browser flows with an opt-in demo wallet.
- Generate CKB Fiber payment requests through server-side API routes.
- Submit CKB Fiber invoices for remittance status tracking.

RGB++ stable assets and BTC are interface placeholders and cannot be withdrawn
in this phase.
Fiber remittance runs in deterministic mock mode when `FIBER_RPC_URL` is empty.
Set `FIBER_RPC_URL` to a trusted local Fiber node RPC endpoint for live node
testing.

## Getting Started

Copy the environment example if needed, install dependencies, and run the
development server:

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Use a funded CKB testnet wallet for withdrawal testing. Wallet approval is
required before any transaction can be broadcast.

## Verification

```bash
pnpm lint
pnpm test
pnpm test:e2e
pnpm build
```

The browser tests enable demo mode only inside the Playwright development
server. `NEXT_PUBLIC_ENABLE_DEMO_MODE` must remain `false` for ordinary builds.

## Demo and Readiness

See the complete demo procedure, production-readiness assessment, and roadmap:

[`../docs/demo-and-readiness-guide.md`](../docs/demo-and-readiness-guide.md)
