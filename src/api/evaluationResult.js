export default (_fetch) => ({
  updateTeacherResponses(result_id, data) {
    return _fetch('PUT', `evaluation-result/${result_id}/teacher_responses`, data);
  }
});
