import { _fetchTemp } from "../api/helpers";


function loadSchedule(body) {
    return _fetchTemp('POST', `event2/load`, body, false)
}

export { loadSchedule }