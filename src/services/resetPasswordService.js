import { fetch_post, fetch_put } from "./fetch";

export function requestResetPassword(email) {
    return fetch_post('api/v1/auth/reset-password', { email })
}

export function resetPassword(password, token) {
    return fetch_put('api/v1/auth/reset-password-confirm', { password, token })
}
