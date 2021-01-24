import { fetch_post } from "./fetch";

export function createSchoolCycle(year, type, segments) {
    return fetch_post(`api/v1/school-cycle`, { year, type, segments})
}