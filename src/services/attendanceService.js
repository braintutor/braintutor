import { fetch_get } from "./fetch";

export function getAttendanceRecords(classId) {
    return fetch_get(`api/v1/attendance/${classId}`)
}