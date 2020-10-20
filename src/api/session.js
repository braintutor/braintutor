export default (fetch_get) => ({
  get(session_id) {
    return fetch_get(`session/${session_id}`);
  },
  getAll(classroom_id) {
    return fetch_get(`session?classroom_id=${classroom_id || ''}`);
  }
});
