export type SendMoneyForm = {
    amount:number,
    senderWalletId:number,
    receiverWalletId:number,
    note?:string,
    pin:string
}