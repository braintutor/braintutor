const service = 'https://braintutor-service.herokuapp.com'

function fetch_post(name, data) {
  return fetch(`${service}/${name}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
}

export { service, fetch_post }