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
  // update(id, time_end) {
  //   return _fetch('PATCH', 'evaluation', {
  //     id, time_end
  //   });
  // },
  getSessionResults(session_id) {
    return _fetch('GET', `evaluation/session-result/${session_id}`);
  },
  // Student
  takeExam(evaluation_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/take`)
  },
  finishExam(evaluation_id) {
    return _fetch('POST', `evaluation/${evaluation_id}/finish`)
  },
  updateAnswers(evaluation_id, data) {
    return _fetch('POST', `evaluation/${evaluation_id}/answer`, data)
  },
});
