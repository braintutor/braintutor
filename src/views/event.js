
import { fetch_get } from "@/services/fetch";

export function getEvents(rangeDate){
  console.log(rangeDate)
  return fetch_get(`event2`)
}
