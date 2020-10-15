export default (fetch_get) => ({
  getAll(session_id, classroom_id) {
    return fetch_get(`event?session_id=${session_id || ""}&classroom_id=${classroom_id || ""}`);
  },
});
