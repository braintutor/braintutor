export default (_fetch) => ({
  update(course_material_id, data) {
      return _fetch('PATCH', `course_material/${course_material_id}`, data);
  },
});
