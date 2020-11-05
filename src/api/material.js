export default (_fetch) => ({
    getAll(course_id) {
        return _fetch('GET', `material?course_id=${course_id || ''}`);
    },
});
