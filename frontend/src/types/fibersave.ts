export type AssetType = "CKB" | "BTC" | "RGB_STABLE";

export type ActivityStatus = "pending" | "complete" | "failed" | "expired";

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

export type FiberPaymentStatus = "pending" | "paid" | "expired" | "failed";

export interface FiberPaymentRequest {
  paymentHash: string;
  invoiceAddress: string;
  amount: string;
  asset: AssetType;
  description: string;
  expiresAt: number;
  status: FiberPaymentStatus;
}
