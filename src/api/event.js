export default (_fetch) => ({
  getAll({ session_id, grade_id, section_id }) {
    return _fetch('GET', `event?session_id=${session_id || ""}&grade_id=${grade_id || ""}&section_id=${section_id || ""}`);
  },
});
