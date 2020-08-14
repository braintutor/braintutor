const service = 'http://localhost:5000'
// const service = 'https://braintutor-service-v2.herokuapp.com'

function getHeaders() {
  let token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

async function fetch_get(name) {
  let res = await fetch(`${service}/${name}`, { headers: getHeaders() })
  if (res.status >= 400 && res.status < 600)
    throw await res.json();

  return res.json()
}

async function fetch_post(name, data) {
  let res = await fetch(`${service}/${name}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: getHeaders()
  })
  if (res.status >= 400 && res.status < 600)
    throw await res.json();

  return res.json()
}

export { service, fetch_get, fetch_post, getHeaders }