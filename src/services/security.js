import store from '../store'

function setSession (token, type) { // type 0:teacher 1:student
  localStorage.setItem('token', token);
  localStorage.setItem('type', type);
  store.commit("setSessionExists", true);
}

function getSession() {
  return {
    token: localStorage.getItem('token'),
    type: localStorage.getItem('type')
  };
}

function removeSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('type')
  store.commit("setSessionExists", false);
}

function verifySession(onSuccess, onError) {
  let { token, type } = getSession()
  if (token && type) {
    onSuccess()
  } else {
    onError()
  }
}

export { setSession, getSession, removeSession, verifySession }