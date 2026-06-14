# FiberSave - Funding Submission Design Spec

## Project Summary

FiberSave is a mobile-first, non-custodial savings and remittance application built on CKB, Fiber Network, and RGB++ assets. It gives users a practical way to save in BTC or stable RGB++ assets, organize funds around savings goals, and later send low-cost instant payments through Fiber.

The project is designed for users in emerging markets where informal savings groups, expensive remittance providers, and limited access to stable financial tools are common. FiberSave aims to turn CKB and Fiber infrastructure into a consumer-facing financial product with clear real-world utility.

## Funding Request Purpose

Funding would support the design, development, testing, and launch of the first FiberSave MVP. The initial funded milestone would focus on personal non-custodial savings, wallet integration, asset balance display, savings goals, deposits, withdrawals, and activity tracking.

Later milestones would expand FiberSave into Fiber-powered remittance and transparent group savings circles.

## Problem Statement

Millions of people save and move money through informal systems because traditional financial services are expensive, slow, inaccessible, or difficult to trust.

Common problems include:

- High fees for local and cross-border remittance
- Slow settlement times
- Limited access to stable digital savings products
- Custodial risk from centralized platforms
- Poor visibility into informal group savings arrangements
- Difficulty organizing savings toward real-life goals
- Lack of consumer applications that make CKB and Fiber useful to everyday users

While CKB, RGB++, and Fiber provide strong infrastructure, there are few consumer applications that package these capabilities into a simple savings and remittance experience.

## Proposed Solution

FiberSave provides a non-custodial savings application where users can:

- Create or connect a wallet
- Hold BTC and supported RGB++ assets
- Create savings goals
- Track progress toward specific targets
- Deposit and withdraw funds
- View transaction and savings activity
- Later send instant low-cost payments through Fiber
- Later participate in transparent digital savings circles

The first version focuses on a realistic and useful MVP: personal savings. This reduces implementation risk while establishing the foundation for remittance and group savings features.

## Why CKB, Fiber, and RGB++

FiberSave is a strong fit for the CKB ecosystem because it uses the strengths of multiple layers:

- CKB provides secure ownership, settlement, and long-term asset state.
- Fiber enables instant, low-cost payments through payment channels.
- RGB++ enables stable and tokenized assets suitable for savings and remittance.

Together, these technologies can support a practical consumer finance product rather than only infrastructure-level experimentation.

## Target Users

Primary users:

- Individuals saving toward rent, school fees, medical needs, emergency funds, equipment, or family support
- Freelancers and remote workers receiving digital payments
- Users who need stable savings access without relying on custodial platforms
- People sending money to family or community members
- Members of informal savings groups who need better tracking and transparency

Secondary users:

- Community cooperatives
- Small merchant groups
- Employer payout programs
- Local savings clubs
- Digital financial inclusion projects

## MVP Scope

The first funded MVP should focus on personal savings.

### MVP Features

- Wallet creation or wallet connection
- BTC and supported RGB++ asset balance display
- Savings goal creation
- Goal target amount and optional deadline
- Deposit flow
- Withdraw flow
- Assigning available funds to goals
- Goal progress tracking
- Activity history for deposits, withdrawals, and goal updates
- Basic settings for wallet, security, and display currency
- Mobile-first interface

### MVP Exclusions

The following features are intentionally deferred to reduce scope and improve delivery reliability:

- Full Fiber remittance
- Savings circles
- Yield products
- Credit scoring
- Merchant tools
- Employer payroll
- Complex multi-asset routing

## Future Milestones

### Milestone 2: Fiber Remittance

Features:

- Send supported assets through Fiber
- Generate payment requests
- Scan payment QR codes
- Share payment links
- Preview fee and route status
- Show pending, failed, expired, and completed payment states
- Add remittance records to activity history

Outcome:

FiberSave becomes not only a savings app, but also a low-cost instant payment and remittance tool.

### Milestone 3: Digital Savings Circles

Features:

- Create savings circles
- Invite members
- Define contribution amount and frequency
- Set payout order
- Track contributions
- Show missed contributions
- Display payout schedule
- Maintain transparent member activity

Outcome:

FiberSave supports community-based savings models with better visibility and digital settlement.

## User Experience

FiberSave should feel like a focused financial tool, not a complex crypto wallet. The user interface should prioritize clarity, confidence, and repeated use.

Core screens:

- Onboarding
- Wallet setup or connection
- Dashboard
- Savings goals
- Deposit
- Withdraw
- Activity
- Settings

Later screens:

- Send money
- Payment requests
- QR scanner
- Savings circles
- Circle contribution tracker
- Payout schedule

## Technical Architecture

### Frontend

The frontend will be mobile-first and optimized for simple financial workflows.

Responsibilities:

- User onboarding
- Wallet connection
- Balance display
- Savings goal creation and tracking
- Deposit and withdrawal flows
- Activity history
- Error states and transaction feedback

### Wallet Layer

The wallet layer will handle user-controlled assets and signing.

Responsibilities:

- Wallet creation or connection
- Key ownership by the user
- Transaction signing
- Recovery and backup flow
- Asset balance access

The product should maintain a clear non-custodial boundary: FiberSave should not control user funds.

### CKB Layer

The CKB layer will support ownership, settlement, and any verifiable state needed by the application.

Possible responsibilities:

- Asset ownership
- Settlement state
- Transaction references
- Future savings circle state

For the MVP, savings goals may begin as app-level metadata rather than locked on-chain scripts. This keeps the first version achievable while preserving a path to stronger on-chain enforcement later.

### Fiber Layer

The Fiber layer will be introduced in the remittance milestone.

Responsibilities:

- Instant payment routing
- Payment channels
- Payment request handling
- Low-cost transfer settlement
- Route failure handling

### RGB++ Asset Layer

RGB++ support enables stable digital savings and multi-asset balances.

Responsibilities:

- Supported asset display
- Stable asset support
- Tokenized balance tracking
- Asset selection for goals and payments

The MVP should begin with a narrow supported asset set, such as BTC and one stable RGB++ asset, rather than attempting broad asset support immediately.

### Optional Backend

A backend may be used for indexing and metadata, but not custody.

Possible responsibilities:

- Savings goal metadata
- Activity indexing
- User preferences
- Payment link metadata
- Notification scheduling
- Savings circle invitations

The backend must not have the ability to move user funds without user signatures.

## Data Model Draft

### User

- Wallet address
- Display name
- Preferred fiat display currency
- Notification preferences

### Savings Goal

- Goal ID
- Owner wallet address
- Name
- Target amount
- Asset type
- Assigned amount
- Optional target date
- Status: active, completed, archived

### Activity Event

- Event ID
- Wallet address
- Event type
- Asset
- Amount
- Status
- Timestamp
- Transaction reference

### Payment Request

- Request ID
- Recipient wallet address
- Asset
- Amount
- Expiration time
- Status

### Savings Circle

- Circle ID
- Organizer wallet address
- Members
- Contribution amount
- Contribution frequency
- Payout order
- Current cycle
- Status

## Development Plan

### Phase 1: Product and Technical Foundation

Deliverables:

- Final MVP requirements
- Wallet approach decision
- Supported asset decision
- UX wireframes
- Technical architecture
- Data model
- Development environment setup

### Phase 2: MVP Implementation

Deliverables:

- Mobile-first frontend
- Wallet creation or connection
- Balance display
- Savings goal creation
- Deposit and withdrawal flows
- Activity history
- Settings screen
- Basic error handling

### Phase 3: Testing and Demo

Deliverables:

- End-to-end user flow testing
- Transaction state testing
- UI responsiveness testing
- Security review of custody boundaries
- Demo build
- Documentation

### Phase 4: Fiber Remittance Prototype

Deliverables:

- Payment request generation
- Send flow
- QR or payment link support
- Payment status states
- Remittance activity history

## Expected Outcomes

The funded MVP should produce:

- A working FiberSave prototype or MVP
- A clear non-custodial savings experience
- A reusable frontend and wallet foundation
- Demonstrable CKB/RGB++ asset support
- A path toward Fiber remittance
- Documentation suitable for ecosystem review
- A consumer-facing use case for CKB infrastructure

## Success Metrics

MVP success can be measured by whether users can:

- Create or connect a wallet
- View supported asset balances
- Create a savings goal
- Assign funds to the goal
- Track progress
- Withdraw funds
- View activity history
- Understand that they retain control of their assets

Future product metrics may include:

- Number of created savings goals
- Total value assigned to goals
- Number of completed goals
- Number of remittance transactions
- Average remittance cost
- Number of active savings circles
- User retention after first deposit

## Ecosystem Value

FiberSave can benefit the CKB ecosystem by:

- Demonstrating a real consumer use case for Fiber
- Showing how RGB++ assets can support practical savings behavior
- Creating a simple on-ramp for users who are not developers
- Encouraging wallet, payment, and asset integrations
- Providing a showcase application for grants, hackathons, and ecosystem growth
- Expanding CKB from infrastructure into everyday financial workflows

## Risks and Mitigations

### Risk: MVP scope becomes too large

Mitigation:

Start with personal savings only. Defer remittance and savings circles to later milestones.

### Risk: Wallet and asset support becomes complex

Mitigation:

Support a narrow asset set first and make the wallet model explicit before implementation.

### Risk: Savings goals are misunderstood as locked funds

Mitigation:

Clearly explain whether goals are labels over available balances or enforced by scripts.

### Risk: Fiber routing failure affects user trust

Mitigation:

Add clear payment states in the remittance milestone: pending, failed, expired, and complete.

### Risk: Group savings creates dispute complexity

Mitigation:

Treat savings circles as a later milestone and define missed contribution, payout, and member visibility rules before implementation.

## Open Technical Decisions

Before development begins, the following decisions should be finalized:

- Wallet creation versus wallet connection
- First supported assets
- Metadata storage model
- Whether savings goals are app-level metadata or on-chain state
- Required CKB scripts or contracts
- Fiber integration approach
- Activity indexing approach
- Fiat exchange-rate source
- Security and recovery model
- Privacy model for group savings

## Funding Use

Funding would be used for:

- Product design
- Technical architecture
- Frontend development
- Wallet integration
- CKB/RGB++ integration
- Testing and QA
- Documentation
- Demo preparation
- Fiber remittance prototype research

The first funding target should be tied to a focused MVP rather than the full long-term product. This improves delivery confidence and gives funders a clear milestone to evaluate.

## Long-Term Vision

FiberSave can grow into a broader financial coordination platform for savings, payments, and community finance.

Potential future features:

- Fiber remittance
- Digital savings circles
- Merchant payouts
- Bill payments
- Employer payroll disbursement
- Savings-based credit reputation
- Stable asset savings plans
- Community cooperative finance tools
- Yield integrations where appropriate and safe

## Conclusion

FiberSave turns CKB, Fiber, and RGB++ infrastructure into a focused consumer product for savings and remittance. The project begins with a practical non-custodial savings MVP, then expands into instant payments and transparent group savings.

With funding, FiberSave can become a strong demonstration of how CKB ecosystem technology can solve everyday financial problems for users who need low-cost, transparent, and user-controlled financial tools.
