import type { BusinessStatus, BusinessType, TransactionStatus, TransactionType, WalletUserType } from "../enums"

export type WalletInfo = {
    walletId:number
    userId:number
    phoneNo:string
    fullName:string
    accountType?:WalletUserType    
}

export type TransactionListItem = {
    trxId: string
    amount: number
    status: TransactionStatus
    note?: string
    operation: string

    receiverWallet: WalletInfo
    senderWallet: WalletInfo

    createdAt: string
    updatedAt: string
}

export type TransactionLogListItem = {
    logId:string
    trxId:string
    trxType:TransactionType
    amount:number
    status:TransactionStatus
    note?:string
    operation:string

    userId:string
    walletInfo:WalletInfo
    createdAt:string
}

export type TransactionDetail = {
    trxId:string
    amount:number
    status:TransactionStatus
    note?:string
    operation:string

    receiverWallet:WalletInfo
    senderWallet:WalletInfo

    createdAt:string
    updatedAt:string
}

export type OwnerInfo = {
  userId: number;
  fullName: string;
  profileUrl?: string;
};

export type ApproverInfo = {
  approverId: number;
  approvedAt: string;
  approverFullName: string;
};

export type BusinessProfileListItem = {
  businessId: number;
  qualifiedName: string;
  bannerUrl?: string;
  description: string;
  businessType: BusinessType;
  createdAt: string;
  status: BusinessStatus;

  owner: OwnerInfo;
  approver: ApproverInfo;
};