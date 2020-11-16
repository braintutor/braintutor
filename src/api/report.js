export default (_fetch) => ({
    getAll({ course_id }) {
        return _fetch('GET', `report?course_id=${course_id || ''}`);
    },
    get(material_id) {
        return _fetch('GET', `report/${material_id}`);
    },
    update(data) {
        return _fetch('PATCH', `report`, data);
    },
});
