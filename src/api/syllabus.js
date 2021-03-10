export default (_fetch) => ({
    byCourse(course_id) {
        return _fetch('GET', `syllabus?course_id=${course_id}`);
    },    
});
