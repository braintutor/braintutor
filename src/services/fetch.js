import { getSession } from './security'

// const service = 'https://braintutor-service.herokuapp.com'
const service = 'https://braintutor-service-v2.herokuapp.com'
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getSession().token}`
}

function fetch_get(name) {
  return fetch(`${service}/${name}`, { headers })
    .then(response => response.json())
}

function fetch_post(name, data) {
  return fetch(`${service}/${name}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers
  })
    .then(response => response.json())
}

export { service, fetch_get, fetch_post }