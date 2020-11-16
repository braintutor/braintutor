export default (_fetch) => ({
  getAll() {
    return _fetch('GET', `course`);
  },
  get(course_id) {
    return _fetch('GET', `course/${course_id}`);
  }
});
