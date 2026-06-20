# FiberSave MVP Demo Script

## Setup

1. Start the frontend with `pnpm dev`.
2. Open the application on desktop or mobile.
3. Connect a funded CKB testnet wallet.
4. Keep the CKB testnet explorer available in another tab.

## Demo Flow

1. Connect the wallet and show the live CKB balance.
2. Open **Goals** and create a goal named `School Fees`.
3. Set a CKB target and return to the goal detail.
4. Assign part of the wallet balance to the goal.
5. Return to the dashboard and show the updated goal progress.
6. Open **Activity** and show the goal creation and assignment records.
7. Open **Deposit**, show the wallet QR code, and copy the address.
8. Open **Withdraw**, enter a valid CKB testnet recipient and amount, then approve the transaction in the wallet.
9. Show the pending activity record and its CKB Explorer link.
10. Refresh Activity after confirmation and show the completed state.

## Product Boundary

- FiberSave never stores private keys.
- Savings assignments are planning metadata and do not lock funds.
- CKB withdrawals require explicit wallet approval.
- RGB++ assets, Fiber remittance, and savings circles are later milestones.

## Funding Narrative

The MVP proves the personal savings foundation: wallet ownership, live balances,
goal-based organization, deposit discovery, signed withdrawals, and transparent
activity. The next funded milestone adds Fiber payment requests and instant
remittance.
