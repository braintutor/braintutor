export default (fetch_get) => ({
  getAll(classroom_id) {
    return fetch_get(`student?classroom_id=${classroom_id}`);
  },
});