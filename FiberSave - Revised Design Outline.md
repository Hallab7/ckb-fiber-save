# FiberSave - Revised Design Outline

## Overview

FiberSave is a mobile-first, non-custodial savings and remittance application built around CKB, Fiber Network, and RGB++ assets. It helps users save in BTC or stable RGB++ assets, track savings goals, and eventually send low-cost instant payments through Fiber.

The product is designed for users in markets where informal savings groups, expensive remittance providers, and limited access to stable savings tools are common.

## Problem

Many users rely on informal financial systems to save and move money. These systems often have high costs, slow settlement, weak transparency, and limited user control.

Current pain points include:

- High remittance fees
- Slow domestic and cross-border settlement
- Limited access to stable digital savings products
- Custodial risk from centralized wallets or intermediaries
- Poor transparency in group savings arrangements
- Difficulty tracking savings goals across volatile assets

FiberSave addresses these problems by combining non-custodial wallet ownership, goal-based savings, Fiber payments, and transparent group savings workflows.

## Product Thesis

FiberSave should not be just another wallet. Its core identity is:

- A personal savings app first
- A remittance tool second
- A group savings platform third

This phased approach keeps the first version realistic while leaving room for FiberSave to become a broader consumer finance application.

## Target Users

Primary users:

- Individuals saving toward concrete goals such as rent, tuition, emergency funds, equipment, or family support
- Freelancers and remote workers receiving digital payments
- Users who need low-cost remittance to family or community members
- Members of informal savings groups who need better contribution tracking

Secondary users:

- Small community cooperatives
- Merchant payout groups
- Employers or organizations that may later use FiberSave for payroll or disbursements

## MVP Scope

The first MVP should focus on personal savings only. Fiber remittance and savings circles are important, but they introduce additional routing, state management, compliance, and dispute-handling complexity.

### MVP: Personal Savings

Users can:

- Create or connect a wallet
- View BTC and supported RGB++ asset balances
- Create savings goals
- Assign deposits to a savings goal
- Track progress toward a target amount
- View basic deposit, withdrawal, and goal activity
- Withdraw available funds at any time

The MVP should prove that users can safely hold funds, organize them around goals, and understand their progress without relying on a custodian.

### Next Milestone: Fiber Remittance

Users can:

- Send supported assets through Fiber
- Generate payment requests
- Scan or share payment links
- View payment status
- See failed, pending, and completed transfers
- Keep remittance history in the activity feed

This milestone proves FiberSave can move funds quickly and cheaply, not only store and organize them.

### Later Milestone: Group Savings Circles

Users can:

- Create a savings circle
- Invite members
- Define contribution amount, frequency, and payout order
- Track member contributions
- View upcoming payout cycles
- Record payouts transparently

This should be treated as a later milestone because group savings requires careful handling of missed payments, payout rules, member disputes, privacy, and on-chain state.

## User Stories

### Personal Savings

- As a user, I want to create a savings goal with a target amount so I can track progress toward something important.
- As a user, I want to deposit BTC or a stable RGB++ asset into my wallet so I can begin saving.
- As a user, I want to assign part of my balance to a savings goal so my money feels organized.
- As a user, I want to withdraw funds at any time so I remain in control of my money.
- As a user, I want to see recent activity so I can understand what changed in my balance.

### Remittance

- As a sender, I want to send funds instantly through Fiber so I can support family or pay someone without high fees.
- As a recipient, I want to generate a payment request so the sender can pay the correct amount.
- As a user, I want to see whether a payment is pending, failed, or complete so I know what action to take.

### Savings Circles

- As a group organizer, I want to create a savings circle with contribution rules so members understand their obligations.
- As a member, I want to see who has contributed so the group can operate transparently.
- As a member, I want to see the payout schedule so I know when each participant receives funds.

## Core User Flows

### Personal Savings Flow

1. Onboard
2. Create or connect wallet
3. Back up recovery information
4. Create savings goal
5. Deposit funds
6. Assign funds to goal
7. Monitor progress
8. Withdraw when needed

### Remittance Flow

1. Connect wallet
2. Enter recipient or scan payment request
3. Specify amount and asset
4. Preview fee and route status
5. Confirm payment
6. Route payment through Fiber
7. Show success, pending, or failure state
8. Record transaction in activity history

### Savings Circle Flow

1. Create circle
2. Define contribution rules
3. Invite members
4. Members join and deposit contributions
5. Contributions are tracked
6. Payouts are made according to rules
7. Circle history remains visible to members

## Core Screens

### Onboarding

- Product introduction
- Create wallet
- Connect existing wallet
- Recovery backup flow
- Security confirmation

### Dashboard

- Total wallet balance
- Balance by asset
- Active savings goals
- Recent activity
- Quick actions for deposit, withdraw, send, and create goal

### Savings Goals

- Goal list
- Goal detail
- Target amount
- Current progress
- Deadline or optional target date
- Deposit to goal
- Withdraw from goal
- Goal activity

### Send Money

- Recipient input
- QR scanner
- Payment link support
- Asset selector
- Amount entry
- Fee and route preview
- Confirmation screen
- Success receipt
- Failed payment recovery state

### Activity

- Deposits
- Withdrawals
- Goal assignments
- Remittance history
- Circle contributions
- Status labels for pending, complete, and failed events

### Savings Circles

- Circle overview
- Members list
- Contribution tracker
- Payout schedule
- Missed contribution state
- Circle activity

### Settings

- Wallet management
- Recovery and backup
- Security preferences
- Currency display preferences
- Notification preferences
- Supported asset preferences

## Technical Architecture

### Frontend

The frontend should be mobile-first and optimized for repeated financial workflows.

Responsibilities:

- Wallet connection and onboarding UI
- Balance and activity views
- Goal creation and progress tracking
- Payment request and QR flows
- Savings circle management screens
- Clear transaction states and error handling

### Wallet Layer

The wallet layer is responsible for user-controlled key management and transaction signing.

Open decisions:

- Whether the first version creates an embedded wallet or connects to an existing wallet
- How recovery and backup are handled
- Whether goal metadata is stored locally, server-side, or on-chain
- Which signing flows are required for BTC, CKB, RGB++, and Fiber operations

### Fiber Layer

The Fiber layer is responsible for instant payment routing and low-cost transfers.

Responsibilities:

- Payment channels
- Payment routing
- Payment request generation
- Payment status tracking
- Failure handling when a route is unavailable

The remittance milestone should include clear pending, failed, expired, and completed states.

### CKB Layer

The CKB layer is responsible for ownership, settlement, and any app state that must be verifiable.

Possible responsibilities:

- Asset ownership records
- Final settlement when needed
- Goal or savings metadata if on-chain state is required
- Group savings state if rules are enforced by scripts

Important decision:

Savings goals in the MVP may be app-level metadata rather than locked on-chain funds. This keeps the first version simpler while still giving users a useful savings experience.

### RGB++ Asset Layer

RGB++ support enables stable asset savings and multi-asset balances.

Responsibilities:

- Stable asset representation
- Tokenized balances
- Asset selection
- Multi-asset savings goals
- Display of asset-specific balances and activity

Open decision:

The MVP should choose a narrow supported asset set first. Supporting BTC and one stable RGB++ asset is more realistic than supporting many assets at launch.

### Optional Backend

A backend may be useful for non-custodial metadata and indexing, but it should not custody user funds.

Possible responsibilities:

- User profile metadata
- Savings goal metadata
- Activity indexing
- Notification scheduling
- Payment link metadata
- Savings circle invitations

Any backend design should make the custody boundary explicit: the backend can organize and index data, but it should not control user funds.

## Data Model Draft

### User

- Wallet address
- Display name
- Preferred currency
- Notification preferences

### Savings Goal

- Goal ID
- Owner wallet address
- Name
- Target amount
- Asset type
- Current assigned amount
- Optional target date
- Status: active, completed, archived

### Activity Event

- Event ID
- Wallet address
- Type: deposit, withdrawal, goal assignment, remittance, circle contribution
- Asset
- Amount
- Status: pending, complete, failed
- Timestamp
- Transaction reference when available

### Savings Circle

- Circle ID
- Organizer wallet address
- Members
- Contribution amount
- Contribution frequency
- Payout order
- Current cycle
- Circle status

## Key Product Decisions

These decisions should be resolved before implementation:

- Are savings goals only labels over wallet balances, or are funds locked?
- Which wallet model is used for the first version?
- Which asset is supported first?
- Where is goal metadata stored?
- What data must be on-chain versus indexed off-chain?
- How are exchange rates and fiat display values sourced?
- What happens when a Fiber payment route fails?
- Are group savings rules enforced by scripts or tracked transparently in the app?
- What privacy should members have inside a savings circle?

## Success Criteria

The MVP is successful if a user can:

- Create or connect a wallet
- See their balance
- Create a savings goal
- Deposit or receive funds
- Assign funds to a goal
- Track progress clearly
- Withdraw funds without custodial approval
- Understand their activity history

The remittance milestone is successful if a user can:

- Generate or scan a payment request
- Send funds through Fiber
- Understand the fee and route status
- See a clear final payment state

The savings circle milestone is successful if a group can:

- Create a circle
- Add members
- Track contributions
- View payout order
- Maintain transparent history

## Future Opportunities

- Yield integrations
- Merchant payouts
- Bill payments
- Credit scoring using savings history
- Community savings cooperatives
- Employer payroll disbursement
- Stablecoin payroll rails
- Agent-assisted savings recommendations

## Why This Matters

FiberSave demonstrates a practical consumer use case for Fiber beyond developer experimentation. It shows how instant Bitcoin-native payments, CKB settlement, and RGB++ assets can support savings, remittance, and community finance in markets where traditional financial infrastructure is expensive or unreliable.

The strongest path is to start with a focused savings MVP, prove non-custodial goal-based savings, then expand into Fiber remittance and group savings once the core wallet and activity flows are reliable.
