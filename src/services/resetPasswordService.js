import { fetch_post } from "./fetch";

export function requestResetPassword(email) {
    fetch_post('api/v1/auth/reset-password', { email })
}
