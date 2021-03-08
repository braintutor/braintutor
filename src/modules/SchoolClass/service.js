import { fetch_post, fetch_put} from "@/services/fetch";

function getAll(query = {}) {
  return fetch_post('api/v1/school-class', 
    query
  )
}

export function editMeetingUrl(schoolClassId, meetingUrl) {
  return fetch_put(`api/v1/school-class/${schoolClassId}/meeting/manual-link`, 
    { url: meetingUrl }
  )
}

export function editUseBBB(schoolClassId) {
  return fetch_put(`api/v1/school-class/${schoolClassId}/meeting/bbb`)
}


export { getAll }