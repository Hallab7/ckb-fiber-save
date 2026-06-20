# FiberSave - Implementation Plan

A mobile-first, non-custodial savings and remittance application built around CKB, RGB++ assets, and the Fiber Network. Users create or connect a wallet, view balances, create savings goals, track progress, and later send low-cost instant payments through Fiber.

The first implementation target is a focused personal savings MVP. Fiber remittance and group savings circles are planned as follow-on milestones after the wallet, balance, goal, and activity foundation is working.

---

## How It Works

```text
User opens FiberSave
    |
Creates or connects wallet
    |
Views BTC / CKB / supported RGB++ asset balances
    |
Creates a savings goal
    |
Assigns available funds to that goal
    |
Tracks progress and activity
    |
Withdraws or sends funds when needed
```

For the MVP, savings goals are app-level metadata linked to a user's wallet address. Funds remain non-custodial and controlled by the user's wallet. Later versions can add stronger on-chain enforcement for locked savings or group savings rules.

---

## Architecture Overview

```text
Mobile-first Frontend
  - Dashboard
  - Savings goals
  - Deposit / withdraw
  - Activity history
  - Settings
  - Later: send money and savings circles

Wallet Layer
  - Wallet connection
  - User signing
  - Address and balance access
  - Recovery / backup flow if embedded wallet is used

Application Metadata Layer
  - Savings goals
  - Goal assignments
  - User preferences
  - Activity cache
  - Later: payment links and circle invitations

CKB / RGB++ Layer
  - Asset ownership
  - Balance discovery
  - Transaction references
  - Supported RGB++ asset tracking

Fiber Layer
  - Later milestone
  - Payment requests
  - Instant routed payments
  - Payment status tracking
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js + TypeScript |
| Styling | Tailwind CSS |
| Wallet / CKB SDK | CCC (`@ckb-ccc/connector-react`, `@ckb-ccc/core`) |
| Network | CKB Testnet first |
| App metadata | Local JSON during prototype, then SQLite/Postgres/Vercel KV |
| RGB++ support | RGB++ SDK or ecosystem-supported asset APIs, depending on available tooling |
| Fiber payments | Fiber node JSON-RPC or `fiber-checkout` style wrapper in later phase |

---

## Product Scope by Phase

| Phase | Scope | Goal |
|-------|-------|------|
| Phase 1 | Product foundation | Finalize decisions, project setup, UX skeleton |
| Phase 2 | Wallet and balances | Connect wallet and display supported assets |
| Phase 3 | Savings goals | Create, update, assign, and track goals |
| Phase 4 | Deposits, withdrawals, activity | Make the MVP usable end to end |
| Phase 5 | Testing and demo | Verify flows and prepare funding/demo build |
| Phase 6 | Fiber remittance | Add payment requests and send flow |
| Phase 7 | Savings circles | Add group contribution and payout tracking |

---

## Phase 1 - Product and Project Foundation

### Step 1.1 - Confirm MVP Decisions

Before writing application code, lock down the first implementation decisions:

- Wallet model: connect existing wallet first, embedded wallet later
- Network: CKB testnet first
- First supported assets: CKB/BTC representation plus one stable RGB++ asset if available
- Savings goals: app-level metadata for MVP
- Custody model: user wallet controls all funds
- Backend: optional metadata API, no fund custody

### Step 1.2 - Create Project Structure

Recommended structure:

```text
ckb-fiber-save/
  implementation.md
  docs/
    architecture.md
    product-decisions.md
  frontend/
    app/
    components/
    lib/
    types/
  server/
    api/
    storage/
  scripts/
```

### Step 1.3 - Create Next.js Frontend

```bash
pnpm create next-app@latest frontend --typescript --tailwind --app
cd frontend
pnpm add @ckb-ccc/connector-react @ckb-ccc/core
pnpm add lucide-react
```

### Step 1.4 - Environment Variables

File: `frontend/.env.local`

```text
NEXT_PUBLIC_CKB_NETWORK=testnet
NEXT_PUBLIC_CKB_RPC_URL=https://testnet.ckb.dev/rpc
NEXT_PUBLIC_CKB_INDEXER_URL=https://testnet.ckb.dev/indexer

# Optional metadata API, if using a backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Step 1.5 - Define Shared Types

File: `frontend/types/fibersave.ts`

```typescript
export type AssetType = "CKB" | "BTC" | "RGB_STABLE";

export type ActivityStatus = "pending" | "complete" | "failed";

export type ActivityType =
  | "deposit"
  | "withdrawal"
  | "goal_created"
  | "goal_assignment"
  | "goal_withdrawal"
  | "remittance"
  | "circle_contribution";

export interface WalletProfile {
  address: string;
  displayName?: string;
  preferredCurrency: "USD" | "NGN" | "CKB";
}

export interface AssetBalance {
  asset: AssetType;
  symbol: string;
  amount: string;
  fiatValue?: string;
}

export interface SavingsGoal {
  id: string;
  ownerAddress: string;
  name: string;
  asset: AssetType;
  targetAmount: string;
  assignedAmount: string;
  targetDate?: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  ownerAddress: string;
  type: ActivityType;
  asset: AssetType;
  amount?: string;
  status: ActivityStatus;
  txHash?: string;
  description: string;
  createdAt: string;
}
```

---

## Phase 2 - Wallet Connection and Balance Display

### Step 2.1 - Add CCC Provider

File: `frontend/app/providers.tsx`

```typescript
"use client";

import { CccProvider } from "@ckb-ccc/connector-react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CccProvider>{children}</CccProvider>;
}
```

Wrap the root layout with `Providers`.

### Step 2.2 - Build Connect Wallet Component

File: `frontend/components/connect-wallet-button.tsx`

Responsibilities:

- Show "Connect Wallet" when disconnected
- Show shortened address when connected
- Expose wallet address to dashboard
- Handle wallet rejection state

### Step 2.3 - Build Wallet Utility Module

File: `frontend/lib/wallet.ts`

```typescript
export async function getConnectedAddress(): Promise<string | null>
export function shortenAddress(address: string): string
export async function getPrimaryLockHash(address: string): Promise<string>
```

### Step 2.4 - Build Balance Query Module

File: `frontend/lib/balances.ts`

```typescript
import type { AssetBalance } from "@/types/fibersave";

export async function getCkbBalance(address: string): Promise<AssetBalance>
export async function getRgbAssetBalances(address: string): Promise<AssetBalance[]>
export async function getAllBalances(address: string): Promise<AssetBalance[]>
```

Implementation notes:

1. Use CCC/indexer to query live CKB cells for the connected address.
2. Convert shannons to CKB for display.
3. Stub RGB++ balances during early UI development if the final RGB++ API is not selected yet.
4. Keep the function shape stable so the UI does not change when real RGB++ support is added.

### Step 2.5 - Build Dashboard Page

File: `frontend/app/page.tsx`

Dashboard sections:

- Total savings balance
- Balance by asset
- Active savings goals
- Recent activity
- Quick actions: Deposit, Withdraw, Create Goal, Send

For the MVP, "Send" can be disabled or marked as a coming milestone inside the app logic, not as marketing copy.

---

## Phase 3 - Savings Goal MVP

### Step 3.1 - Choose Metadata Storage

Prototype option:

- Store goals in browser local storage by wallet address.
- Fastest for a demo.
- Not ideal across devices.

MVP option:

- Store goals through API routes in a simple database.
- Key all records by wallet address.
- Never store private keys.
- Never custody funds.

Recommended path:

1. Start with a storage interface.
2. Use local storage first.
3. Swap to API/database when backend is ready.

### Step 3.2 - Create Storage Interface

File: `frontend/lib/goal-store.ts`

```typescript
import type { SavingsGoal } from "@/types/fibersave";

export async function listGoals(ownerAddress: string): Promise<SavingsGoal[]>
export async function getGoal(goalId: string): Promise<SavingsGoal | null>
export async function createGoal(input: {
  ownerAddress: string;
  name: string;
  asset: SavingsGoal["asset"];
  targetAmount: string;
  targetDate?: string;
}): Promise<SavingsGoal>
export async function updateGoal(goalId: string, patch: Partial<SavingsGoal>): Promise<SavingsGoal>
export async function archiveGoal(goalId: string): Promise<void>
```

### Step 3.3 - Build Create Goal Flow

File: `frontend/app/goals/new/page.tsx`

Fields:

- Goal name
- Target amount
- Asset
- Optional target date

Validation:

- Name is required
- Target amount must be greater than zero
- Asset must be supported
- Target date must not be in the past if provided

### Step 3.4 - Build Goal List Page

File: `frontend/app/goals/page.tsx`

Show:

- Goal name
- Target amount
- Assigned amount
- Progress percentage
- Asset symbol
- Status

### Step 3.5 - Build Goal Detail Page

File: `frontend/app/goals/[goalId]/page.tsx`

Show:

- Goal progress
- Assigned amount
- Remaining amount
- Target date
- Related activity
- Actions: assign funds, withdraw from goal, archive goal

### Step 3.6 - Add Goal Assignment Logic

File: `frontend/lib/goal-actions.ts`

```typescript
export async function assignFundsToGoal(input: {
  ownerAddress: string;
  goalId: string;
  asset: string;
  amount: string;
}): Promise<void>

export async function removeFundsFromGoal(input: {
  ownerAddress: string;
  goalId: string;
  asset: string;
  amount: string;
}): Promise<void>
```

MVP rule:

Goal assignment is metadata only. It does not lock funds. The UI must make the user's available wallet balance and assigned goal balance clear.

---

## Phase 4 - Deposits, Withdrawals, and Activity

Implementation status: complete for native CKB on testnet. Deposits use
balance-delta detection, withdrawals are built and signed through CCC, and
broadcast transaction activity is reconciled against the CKB node. RGB++ and
BTC transfers remain deferred until their integration paths are selected.

### Step 4.1 - Deposit Flow

File: `frontend/app/deposit/page.tsx`

Show:

- Connected wallet address
- QR code for address
- Copy address button
- Supported asset list
- Recent deposit activity

Implementation steps:

1. Read connected wallet address.
2. Generate QR code for address.
3. Let the user copy the address.
4. Poll balance periodically or provide a refresh button.
5. Create a deposit activity event when balance increases, if indexing support is available.

### Step 4.2 - Withdrawal Flow

File: `frontend/app/withdraw/page.tsx`

Fields:

- Recipient address
- Asset
- Amount
- Optional note

Implementation steps:

1. Validate recipient address.
2. Validate amount against available balance.
3. Build transaction using CCC.
4. Ask wallet to sign.
5. Broadcast transaction.
6. Add pending activity event.
7. Update activity when transaction confirms.

### Step 4.3 - Activity Store

File: `frontend/lib/activity-store.ts`

```typescript
import type { ActivityEvent } from "@/types/fibersave";

export async function listActivity(ownerAddress: string): Promise<ActivityEvent[]>
export async function addActivity(event: Omit<ActivityEvent, "id" | "createdAt">): Promise<ActivityEvent>
export async function updateActivityStatus(
  eventId: string,
  status: ActivityEvent["status"],
  txHash?: string
): Promise<ActivityEvent>
```

### Step 4.4 - Activity Page

File: `frontend/app/activity/page.tsx`

Show:

- Deposits
- Withdrawals
- Goal assignments
- Goal withdrawals
- Later: remittance and circle contribution events

Filters:

- All
- Deposits
- Withdrawals
- Goals
- Pending

### Step 4.5 - Settings Page

File: `frontend/app/settings/page.tsx`

Settings:

- Connected wallet
- Preferred display currency
- Security/recovery reminder
- Supported assets
- Clear local metadata during development

---

## Phase 5 - MVP Testing, Polish, and Demo

Implementation status: automated unit tests, desktop/mobile browser flows,
available-balance validation, dashboard goal progress, responsive interaction
polish, and demo documentation are implemented. The funded-wallet manual
testnet checklist remains an operator verification step before a public demo.

### Step 5.1 - Unit Tests

Test files:

```text
frontend/lib/goal-store.test.ts
frontend/lib/goal-actions.test.ts
frontend/lib/activity-store.test.ts
frontend/lib/balances.test.ts
```

Test cases:

- Create goal
- Reject invalid target amount
- Assign funds to goal
- Reject assignment over available balance
- Remove funds from goal
- Complete goal when assigned amount reaches target
- Add activity event
- Update activity status

### Step 5.2 - UI Flow Tests

Use Playwright once the frontend is running.

Flows:

1. Connect wallet mock state.
2. Create a savings goal.
3. Assign funds to the goal.
4. View dashboard progress.
5. Open goal detail page.
6. Remove funds from goal.
7. View activity history.

### Step 5.3 - Manual Testnet Tests

Checklist:

- Wallet connects successfully.
- CKB balance displays correctly.
- Deposit address copies correctly.
- Testnet deposit is reflected after refresh.
- Withdrawal transaction can be signed.
- Withdrawal transaction appears on explorer.
- Activity state moves from pending to complete.

### Step 5.4 - UX Polish

Polish items:

- Empty states for no wallet, no goals, no activity
- Loading states for balances and transactions
- Error states for wallet rejection
- Transaction pending state with explorer link
- Consistent amount formatting
- Mobile layout review

### Step 5.5 - Demo Preparation

Demo script:

1. Open FiberSave.
2. Connect wallet.
3. Show balances.
4. Create "School Fees" savings goal.
5. Assign funds to the goal.
6. Show progress on dashboard.
7. Open activity history.
8. Show deposit address.
9. Explain path to Fiber remittance and group savings.

---

## Phase 6 - Fiber Remittance Milestone

This phase begins after the savings MVP is working.

### Step 6.1 - Run Fiber Node

Development node:

```bash
docker pull ghcr.io/nervosnetwork/fiber:latest
docker run -d \
  -p 8228:8228 \
  -p 8229:8229 \
  -e FIBER_CKB_RPC_URL=https://testnet.ckb.dev \
  -e FIBER_LISTENING_ADDR=/ip4/0.0.0.0/tcp/8229 \
  ghcr.io/nervosnetwork/fiber:latest
```

Environment:

```text
FIBER_RPC_URL=http://localhost:8228
FIBER_NODE_PUBKEY=<node_pubkey>
```

### Step 6.2 - Fiber RPC Client

File: `frontend/lib/fiber-rpc.ts` or server-side `server/fiber-rpc.ts`

```typescript
export async function getNodeInfo(): Promise<unknown>
export async function createPaymentRequest(input: {
  amount: string;
  asset: string;
  description: string;
  expirySeconds: number;
}): Promise<{
  paymentHash: string;
  invoiceAddress: string;
  expiresAt: number;
}>
export async function getPaymentStatus(paymentHash: string): Promise<
  "pending" | "paid" | "expired" | "failed"
>
export async function sendPayment(invoiceAddress: string): Promise<{
  paymentHash: string;
  status: string;
}>
```

### Step 6.3 - API Routes

Recommended routes:

```text
POST /api/payment-request
GET  /api/payment-request/[paymentHash]
POST /api/send-payment
```

Implementation notes:

- Keep Fiber RPC URL server-side.
- Store payment request metadata.
- Poll payment status from frontend.
- Add remittance events to activity history.

### Step 6.4 - Send Money Page

File: `frontend/app/send/page.tsx`

Fields:

- Recipient or invoice
- Amount
- Asset
- Note

States:

- Draft
- Route checking
- Awaiting confirmation
- Sending
- Complete
- Failed
- Expired

### Step 6.5 - Receive Payment Page

File: `frontend/app/receive/page.tsx`

Features:

- Generate payment request
- Show QR code
- Copy payment link
- Show expiry time
- Show payment status

### Step 6.6 - Remittance Testing

Test flows:

- Generate request
- Pay request from test node or wallet
- Confirm payment status changes
- Failed route shows useful error
- Expired invoice cannot be paid
- Activity history records final state

---

## Phase 7 - Savings Circles Milestone

This phase should start only after the personal savings and remittance flows are stable.

### Step 7.1 - Define Circle Rules

Decisions:

- Are contributions tracked only, or enforced on-chain?
- Can members leave after joining?
- What happens when a member misses a contribution?
- Who can change payout order?
- Are member balances public to the circle?
- How are disputes handled?

### Step 7.2 - Circle Data Model

Types:

```typescript
export interface SavingsCircle {
  id: string;
  organizerAddress: string;
  name: string;
  asset: AssetType;
  contributionAmount: string;
  contributionFrequency: "weekly" | "monthly";
  members: CircleMember[];
  payoutOrder: string[];
  currentCycle: number;
  status: "draft" | "active" | "completed" | "cancelled";
}

export interface CircleMember {
  address: string;
  displayName?: string;
  joinedAt: string;
  status: "invited" | "active" | "removed";
}

export interface CircleContribution {
  id: string;
  circleId: string;
  memberAddress: string;
  cycle: number;
  amount: string;
  status: "pending" | "paid" | "missed";
  txHash?: string;
}
```

### Step 7.3 - Circle Pages

Files:

```text
frontend/app/circles/page.tsx
frontend/app/circles/new/page.tsx
frontend/app/circles/[circleId]/page.tsx
frontend/app/circles/[circleId]/members/page.tsx
frontend/app/circles/[circleId]/contributions/page.tsx
```

### Step 7.4 - Circle Contribution Tracking

Implementation steps:

1. Create circle.
2. Invite members by wallet address or link.
3. Define contribution schedule.
4. Generate expected contribution records.
5. Match incoming payments or transactions to member contributions.
6. Mark contribution as paid, pending, or missed.
7. Show payout schedule.

### Step 7.5 - Future On-Chain Enforcement

If circle rules need stronger guarantees, add CKB scripts later.

Possible script responsibilities:

- Hold group funds
- Enforce payout order
- Enforce member authorization
- Track contribution cycles
- Prevent unauthorized withdrawals

This should not be part of the first MVP unless funding specifically requires on-chain group enforcement.

---

## File Structure - Target MVP

```text
ckb-fiber-save/
  implementation.md
  FiberSave - Revised Design Outline.md
  FiberSave - Funding Submission Design Spec.md
  frontend/
    app/
      layout.tsx
      providers.tsx
      page.tsx
      activity/
        page.tsx
      deposit/
        page.tsx
      goals/
        page.tsx
        new/
          page.tsx
        [goalId]/
          page.tsx
      settings/
        page.tsx
      withdraw/
        page.tsx
    components/
      connect-wallet-button.tsx
      balance-card.tsx
      goal-card.tsx
      goal-progress.tsx
      activity-list.tsx
      amount-input.tsx
      asset-selector.tsx
    lib/
      activity-store.ts
      balances.ts
      format.ts
      goal-actions.ts
      goal-store.ts
      wallet.ts
    types/
      fibersave.ts
```

---

## Build Order

1. Confirm MVP decisions and supported asset assumptions.
2. Create Next.js project.
3. Install CCC, Tailwind, and UI dependencies.
4. Add provider and wallet connection.
5. Implement shared types.
6. Implement balance query stubs.
7. Build dashboard shell.
8. Implement goal storage.
9. Build create goal page.
10. Build goal list and goal detail pages.
11. Implement goal assignment and removal.
12. Implement activity store.
13. Build deposit page.
14. Build withdrawal page.
15. Connect real CKB balance query.
16. Add transaction signing for withdrawals.
17. Add loading, empty, and error states.
18. Test full MVP flow.
19. Prepare demo build.
20. Add Fiber remittance prototype.
21. Add savings circles prototype.

---

## Key Implementation Rules

- Keep the app non-custodial.
- Do not store private keys on the backend.
- Treat savings goals as metadata until on-chain locking is explicitly designed.
- Keep wallet operations behind a small `lib/wallet.ts` interface.
- Keep storage behind interfaces so local storage can be replaced by a backend.
- Keep RGB++ support behind `lib/balances.ts` and asset modules so the UI is not rewritten later.
- Add clear transaction states: draft, signing, pending, complete, failed.
- Do not build group savings until contribution and payout rules are written down.
- Do not build yield or credit features in the MVP.

---

## Funding Milestone Mapping

### Funding Milestone 1 - MVP Foundation

Deliverables:

- Project setup
- Wallet connection
- Dashboard
- Balance display
- Savings goal creation
- Goal progress tracking
- Activity history
- Deposit page
- Withdrawal page
- Demo documentation

### Funding Milestone 2 - Testnet Integration

Deliverables:

- Real CKB testnet balance query
- Withdrawal transaction signing
- Transaction status tracking
- Explorer links
- Manual testnet demo

### Funding Milestone 3 - Fiber Remittance Prototype

Deliverables:

- Fiber node setup
- Payment request generation
- Send payment flow
- QR/payment link support
- Payment status polling
- Remittance activity history

### Funding Milestone 4 - Savings Circle Prototype

Deliverables:

- Circle creation
- Member invitations
- Contribution schedule
- Contribution tracker
- Payout schedule
- Circle activity history

---

## Open Technical Decisions

- Which wallet connector should be the default for the demo?
- Which RGB++ asset should be supported first?
- Which API or SDK should be used for RGB++ balances?
- Should MVP metadata stay local or use a backend immediately?
- Should deposit detection be balance-delta based or transaction-index based?
- How should fiat conversion be sourced?
- Which Fiber node setup is available for testnet demo?
- Should savings circles be app-tracked first or script-enforced from the start?

---

## Definition of Done for MVP

The MVP is done when a user can:

1. Open the app on mobile or desktop.
2. Connect a wallet.
3. View supported balances.
4. Create a savings goal.
5. Assign available funds to the goal.
6. See progress update on the dashboard.
7. View goal-related activity.
8. Open the deposit page and copy their address.
9. Start a withdrawal transaction.
10. Understand all loading, pending, complete, and failed states.

The funding demo is ready when the above flow can be shown reliably from a clean browser session.
