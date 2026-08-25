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



export interface NrcForm {
  districtCode: string;   // e.g., "12"
  townshipCode: string;   // e.g., "MAMANA"
  nrcType: string;        // e.g., "N"
  nrcNo: string;          // e.g., "123456"
}

export interface AddressForm {
  addressContent: string; // e.g., "Street 12, House 4"
  townshipId: number;
  districtId: number;
}

export interface WalletUserForm {
  fullName: string;
  phoneNo: string;
  nrcForm: NrcForm;
  addressForm: AddressForm;
  pin: string;
  confirmPin: string;
}

export interface DistrictInfo {
  districtId: number;
  districtName: string;
  townships: number;
  createdAt: string;
  updatedAt: string;
}

export interface TownshipInfo {
  townshipId: number;
  townshipName: string;
  districtId: number;
  districtName: string;
  createdAt: string;
  updatedAt: string;
}