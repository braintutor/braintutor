export default (_fetch) => ({
    getAll() {
        return _fetch('GET', `school`)
    },
    updateImage(data) {
        return _fetch('PATCH', 'school/image', data, false);
    },
});
