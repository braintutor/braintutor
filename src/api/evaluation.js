export default (_fetch) => ({
  getAll(session_id) {
    return _fetch('GET', `evaluation?session=${session_id}`)
  },
  get(evaluation_id) {
    return _fetch('GET', `evaluation/${evaluation_id}`)
  },
  add(data) {
    return _fetch('POST', 'evaluation', data)
  },
  update(evaluation_id, data) {
    return _fetch('PUT', `evaluation/${evaluation_id}`, data);
  },
  remove(evaluation_id) {
    return _fetch('DELETE', `evaluation/${evaluation_id}`);
  },
  publish(evaluation_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/publish`)
  },
  updateTime(evaluation_id, data) {
    return _fetch('PATCH', `evaluation/${evaluation_id}/time`, data)
  },
  getSessionResults(session_id) {
    return _fetch('GET', `evaluation/session-result/${session_id}`);
  },
  // Student
  getAnswers(evaluation_id) {
    return _fetch('GET', `evaluation/${evaluation_id}/answers`)
  },
  takeExam(evaluation_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/take`)
  },
  finishExam(evaluation_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/finish`)
  },
  updateAnswers(evaluation_id, data) {
    return _fetch('POST', `evaluation/${evaluation_id}/answer`, data)
  },
  addFile(evaluation_id, data) {
    return _fetch('POST', `evaluation/${evaluation_id}/file`, data, false)
  },
  removeFile(evaluation_id, file_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/file/${file_id}`)
  }
});
