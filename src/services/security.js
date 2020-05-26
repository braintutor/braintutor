import store from '../store'

function setSession(token, type, user) { // type 0:teacher 1:student
  localStorage.setItem('token', token);
  localStorage.setItem('type', type);
  localStorage.setItem('user', user);
  store.commit("setSession", getSession());
}

function getSession() {
  return {
    token: localStorage.getItem('token'),
    type: localStorage.getItem('type'),
    user: localStorage.getItem('user'),
  };
}

function removeSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('type')
  localStorage.removeItem('user')
  store.commit("setSession", {});
}

function sessionExists() {
  let { token, type } = getSession()
  return token && type
}

export { setSession, getSession, removeSession, sessionExists }