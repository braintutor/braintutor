
import { fetch_get } from "@/services/fetch";

export function getEvents(rangeDate){
  return fetch_get(`event2?startDate=${rangeDate.startDate}&endDate=${rangeDate.endDate}`)
}
