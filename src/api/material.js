export default (_fetch) => ({
    getAll(course_id) {
        return _fetch('GET', `material?course_id=${course_id || ''}`);
    },
    get(material_id) {
        return _fetch('GET', `material/${material_id}`);
    },
    add(data) {
        return _fetch('POST', `material`, data);
    },
});
