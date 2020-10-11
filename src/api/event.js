export default (fetch_get) => ({
  getAll() {
    return fetch_get("event");
  },
  // getAll(session_id) {
  //   return fetch_get(`event?session_id=${session_id || ''}`);
  // },
});
