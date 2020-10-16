export default (_fetch, fetch_get) => ({
  get(session_id) {
    return fetch_get(`session/${session_id}`);
  },
  getAll(classroom_id) {
    return fetch_get(`session?classroom_id=${classroom_id || ''}`);
  },
  getFiles(session_id) {
    return fetch_get(`session/${session_id}/file`);
  },
  removeFile(session_id, file_id) {
    return _fetch('DELETE', `session/${session_id}/file/${file_id}`);
  },
});
