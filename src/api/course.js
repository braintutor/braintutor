export default (_fetch) => ({
  get(course_id) {
    return _fetch('GET', `course/${course_id}`);
  }
});
