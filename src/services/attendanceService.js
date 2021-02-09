// import { fetch_get } from "./fetch";

// export function getAttendanceRecords() {
//     return fetch_get(`api/v1/attendance`)
// }

export async function getAttendanceRecords(){
    return [
        {student: "Arthur", status: "absence"},
        {student: "Diana", status: "attended"}
    ];
}