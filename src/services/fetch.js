import { getSession } from './security'

const service = 'http://localhost:5000'
// const service = 'https://braintutor-service-v2.herokuapp.com'

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getSession().token}`
  }
}

function fetch_get(name) {
  let headers = getHeaders()
  return fetch(`${service}/${name}`, { headers })
    .then(response => response.json())
}

function fetch_post(name, data) {
  let headers = getHeaders()
  return fetch(`${service}/${name}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  })
    .then(response => response.json())
}

export { service, fetch_get, fetch_post }