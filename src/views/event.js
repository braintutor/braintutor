
import { fetch_get } from "@/services/fetch";
var randomColor = require('randomcolor');

export function generateColor(text){
  return text.length > 20? randomColor({
    seed: text
  }) : text

}
export function getEvents(rangeDate){
  return fetch_get(`event2?startDate=${rangeDate.startDate}&endDate=${rangeDate.endDate}`)
}
