export default (_fetch) => ({
    byCourse(course_id) {
        return _fetch('GET', `material-reference?course_id=${course_id}`);
    },   
    removeMaterialItem(material_reference) {
        return _fetch('DELETE', `material-reference`, { material_reference});
    },  
});
