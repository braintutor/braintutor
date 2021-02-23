// import { fetch_post } from "./fetch";

export function requestResetPassword(email) {
    return Promise.resolve({email}).then(() => new Promise(resolve => setTimeout(resolve, 1000)))
    // return fetch_post('api/v1/auth/reset-password', { email })
}
