# FiberSave Frontend

FiberSave is a non-custodial CKB testnet savings MVP. Wallet connectors control
signing and funds; the application stores savings goals, activity records, and
preferences locally in the browser.

## Phase 4 Capabilities

- Connect a CCC-compatible wallet and read its CKB testnet balance.
- Create savings goals and assign available wallet balance as metadata.
- Display a deposit address and QR code.
- Detect CKB balance increases while the deposit page is open or refreshed.
- Build, sign, and broadcast native CKB withdrawals through the connected wallet.
- Reconcile pending withdrawal activity against the CKB node.
- Link broadcast transactions to the CKB testnet explorer.
- Persist display currency preferences and clear local metadata.

RGB++ stable assets and BTC are interface placeholders and cannot be withdrawn
in this phase.

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
pnpm build
```
