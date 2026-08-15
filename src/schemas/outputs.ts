import type { UserRole } from "../hooks/use-auth"

export type SignInResult = {
    verificationToken:string,
    expiredAt?:string,
    message?:string,
}

export type ProfileInfo = {
    accountId:string
    phoneNo:string
    fullName:string
    role:UserRole
    profileUrl:string    
}

export type WalletUserAuthResult = {
    accessToken:string
    accessType:string
} & ProfileInfo