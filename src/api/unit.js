export default (_fetch) => ({
    getAll(course_id) {
        return _fetch('GET', `unit?course_id=${course_id || ''}`);
    },
    getAllMaterials(course_id) {
        return _fetch('GET', `unit/material?course_id=${course_id || ''}`);
    },
});
