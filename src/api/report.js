export default (_fetch) => ({
    getAll({ course_id, time_start, time_end }) {
        return _fetch('GET', `report?course_id=${course_id || ''}&time_start=${time_start || ''}&time_end=${time_end || ''}`);
    },
    get(material_id) {
        return _fetch('GET', `report/${material_id}`);
    },
    update(data) {
        return _fetch('PATCH', `report`, data);
    },
});
