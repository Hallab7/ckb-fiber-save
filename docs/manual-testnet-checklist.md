# FiberSave Manual Testnet Checklist

Run this checklist with a funded CKB testnet wallet before a public demo.

## Wallet

- [ ] Wallet selection dialog opens.
- [ ] Wallet connects successfully.
- [ ] Connected address is displayed correctly.
- [ ] Live CKB testnet balance matches the wallet.
- [ ] Disconnect returns the app to its empty state.

## Savings Goals

- [ ] Create a `School Fees` goal.
- [ ] Invalid or zero targets are rejected.
- [ ] Assignment above available wallet balance is rejected.
- [ ] Goal progress updates after assignment.
- [ ] Goal progress appears on the dashboard.
- [ ] Removing assigned funds updates progress.
- [ ] Goal events appear in Activity.

## Deposit

- [ ] Deposit address matches the connected wallet.
- [ ] QR code scans to the same address.
- [ ] Copy Address writes the correct value.
- [ ] A testnet deposit increases the displayed balance.
- [ ] Balance refresh records the detected deposit.

## Withdrawal

- [ ] Invalid recipient address is rejected.
- [ ] Amount below occupied-capacity minimum is rejected.
- [ ] Amount that leaves no fee capacity is rejected.
- [ ] Wallet approval opens for a valid withdrawal.
- [ ] Transaction broadcasts successfully.
- [ ] Explorer link opens the correct transaction.
- [ ] Activity moves from pending to complete after confirmation.

## Fiber Remittance

- [ ] `FIBER_SEND_RPC_URL` points to the sender Fiber RPC endpoint.
- [ ] `FIBER_RECEIVE_RPC_URL` points to the receiver Fiber RPC endpoint.
- [ ] Sender and receiver nodes are funded and connected to peers.
- [ ] Required Fiber channels are open and ready.
- [ ] Route liquidity is sufficient for the test payment.
- [ ] Receive page generates a valid Fiber invoice.
- [ ] Invoice QR scans to the same invoice text.
- [ ] Send page submits the invoice successfully.
- [ ] Payment status moves from pending to paid, expired, or failed.
- [ ] Remittance event appears in Activity.

## Responsive Review

- [ ] Dashboard works at 390px width.
- [ ] Goal forms do not overflow.
- [ ] Deposit QR and address fit without overlap.
- [ ] Withdrawal form remains usable on mobile.
- [ ] Activity filters wrap cleanly.
