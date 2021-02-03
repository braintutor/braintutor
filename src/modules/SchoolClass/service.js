import { fetch_post } from "@/services/fetch";

function getAll(query = {}) {
  return fetch_post('api/v1/school-class', 
    query
  )
}



export { getAll}