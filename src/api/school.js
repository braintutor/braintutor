export default (_fetch) => ({
    updateImage(data) {
        return _fetch('PATCH', 'school/image', data, false);
    },
});
