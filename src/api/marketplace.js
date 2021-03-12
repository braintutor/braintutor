export default (_fetch, ) => ({
    index( subject_id, title) {
        return _fetch('GET', `material-marketplace?title=${title}&subject_id=${subject_id || ''}`);
    },

});
