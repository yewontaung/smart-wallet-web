import type { WalletUserStatus, WalletUserType } from "../enums";

export type AccountSearch = {
  q?: string;
  accountType?: WalletUserType;
  accountStatus?: WalletUserStatus;
  createdFrom?: Date;
  createdTo?: Date;
  balanceFrom?: number;
  balanceTo?: number;
  districtId?: number;
};