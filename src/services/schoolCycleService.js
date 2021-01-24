import { fetch_post, fetch_get } from "./fetch";

export function createSchoolCycle(year, type, segments) {
    return fetch_post(`api/v1/school-cycle`, { year, segment_type: type, segments})
}

export function getSchoolCycles() {
    return fetch_get(`api/v1/school-cycle`)
}