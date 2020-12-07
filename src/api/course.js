export default (_fetch) => ({
  getAll({ level, grade_id }) {
    return _fetch('GET', `course?level=${level || ""}&grade_id=${grade_id || ""}`);
  },
  get(course_id) {
    return _fetch('GET', `course/${course_id}`);
  }
});
