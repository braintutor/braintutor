import { fetch_get, fetch_put } from "./fetch";

export function getAttendanceRecords(classId) {
    return fetch_get(`api/v1/attendance/${classId}`)
}

export function markAttendance(classId, studentId, newStatus) {
    return fetch_put(`api/v1/attendance`, {
        student_id: studentId,
        school_class_id: classId,
        new_status: newStatus
    })
}