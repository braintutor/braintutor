export default (fetch_get) => ({
  get(student_id) {
    return fetch_get(`student/${student_id}`);
  },
  getAll(classroom_id, parent_id) {
    return fetch_get(
      `student?classroom_id=${classroom_id || ''}&&parent_id=${parent_id || ''}`
    );
  },
});
