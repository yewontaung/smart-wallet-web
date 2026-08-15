import type { WalletUserSignInForm, WalletUserVerificationForm } from "../schemas/inputs";
import { type WalletUserAuthResult, type SignInResult } from "../schemas/outputs";
import { publicRequest } from "../utils/api";

export async function loginWalletUser(form:WalletUserSignInForm) {
    return await publicRequest<SignInResult>("/wallet-user/auth/sign-in", {
        method: "POST",
        body: form
    })
}

export async function verifyWalletUserLogin(form:WalletUserVerificationForm) {
    return await publicRequest<WalletUserAuthResult>("/wallet-user/auth/sign-in/verify", {
        method: "POST",
        body: form
    })
}