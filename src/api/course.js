export default (_fetch) => ({
  getAll({ level }) {
    return _fetch('GET', `course?level=${level || ""}`);
  },
  get(course_id) {
    return _fetch('GET', `course/${course_id}`);
  }
});
