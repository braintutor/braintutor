import { fetch_get } from "./fetch";

export function getAttendanceRecords(classId) {
    return fetch_get(`api/v1/attendance/${classId}`)
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function markAttendance(classId, attendanceRecordId, newStatus) {
    // return fetch_put(`api/v1/attendance/${classId}`)
    await timeout(3000);
    console.log(classId, attendanceRecordId, newStatus)
    // throw "ahhh error 500"
}