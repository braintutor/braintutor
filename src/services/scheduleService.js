import { _fetchTemp } from "../api/helpers";


function loadSchedule(schoolId, body) {
    return _fetchTemp('POST', `event2/load/${schoolId}`, body, false)
}

export { loadSchedule }