export default (_fetch) => ({
  getAll(course_id) {
      return _fetch('GET', `course_material?course_id=${course_id || ''}`);
  },
  add(data) {
    return _fetch('POST', `course_material`, data);
  },
  update(course_material_id, data) {
      return _fetch('PATCH', `course_material/${course_material_id}`, data);
  },
  remove(course_material_id) {
      return _fetch('DELETE', `course_material/${course_material_id}`);
  },
});
