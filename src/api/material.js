export default (_fetch, Fetch) => ({
    getAll(course_id) {
        return _fetch('GET', `material?course_id=${course_id || ''}`);
    },
    get(material_id) {
        return _fetch('GET', `material/${material_id}`);
    },
    add(data) {
        return _fetch('POST', `material`, data);
    },
    //V2
    index(subject_id) {
        return Fetch('v2', 'GET', `material?subject_id=${subject_id}`);
    },
    show(material_id) {
        return Fetch('v2', 'GET', `material/${material_id}`);
    },
    create(data) {
        return Fetch('v2', 'POST', `material`, data);
    },    
    remove(id) {
        return _fetch('DELETE', `material/${id}`);
    },
});
