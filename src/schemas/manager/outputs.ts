import type { WalletUserStatus, WalletUserType } from "../enums";

export type AccountListItem = {
  userId: number;
  fullName: string;
  nickName?: string;
  profileUrl?: string;
  accountType: WalletUserType;
  accountStatus: WalletUserStatus;
  phoneNo: string;
  createdAt: string;
  approvedAt?: string;
  approverId?: number;
  approverFullName?: string;
  currentBalance: number;
  lastBalance: number;
};