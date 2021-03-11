export default (_fetch) => ({
    byCourse(course_id) {
        return _fetch('GET', `material-reference?course_id=${course_id}`);
    },    
});
