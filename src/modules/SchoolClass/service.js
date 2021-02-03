import { fetch_post, fetch_put} from "@/services/fetch";

function getAll(query = {}) {
  return fetch_post('api/v1/school-class', 
    query
  )
}
function editMeetingUrl(schoolClassId, meetingUrl) {
  return fetch_put(`api/v1/school-class/${schoolClassId}/manual-link`, 
    { url: meetingUrl }
  )
}



export { getAll, editMeetingUrl}