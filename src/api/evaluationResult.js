export default (_fetch) => ({
  updateComment(result_id, data) {
    return _fetch('PUT', `evaluation-result/${result_id}/comment`, data);
  }
});
