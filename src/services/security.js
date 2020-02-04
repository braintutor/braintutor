function setSession(token, type) { // type 0:teacher 1:student
  localStorage.setItem('token', token);
  localStorage.setItem('type', type);
}

function getSession() {
  return {
    token: localStorage.getItem('token'),
    type: localStorage.getItem('type')
  };
}

function verifySession(onSuccess, onError) {
  let { token, type } = getSession()
  if (token && type) {
    onSuccess()
  }
  else
    onError()
}

export { setSession, getSession, verifySession }