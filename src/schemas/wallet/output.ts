export type WalletBalance = {
    walletId:number,
    accountId:number,
    currentBalance:number,
    phoneNo:string,
}

export type ReceiverProfile = {
    userId:number,
    walletId:number,
    fullName:string,
    phoneNo:string
}

export type ActionResult = {
    actionResult:unknown
    actionType:string
    message:string
}