import store from '../store'

function setSession(token, type) { // type 0:teacher 1:student
  localStorage.setItem('token', token);
  localStorage.setItem('type', type);
  store.commit("setSession", getSession());
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
  store.commit("setSession", null);
}

function sessionExists() {
  let { token, type } = getSession()
  return token && type
}

export { setSession, getSession, removeSession, sessionExists }