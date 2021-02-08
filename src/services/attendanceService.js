import { fetch_get } from "./fetch";

export function getAttendanceRecords() {
    return fetch_get(`api/v1/attendance`)
}