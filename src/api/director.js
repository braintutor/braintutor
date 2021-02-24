export default (_fetch) => ({
    getAll() {
        return _fetch('GET', `director`);
    },
    add(data) {
        return _fetch('POST', `director`, data);
    },
    update(user_id, data) {
        return _fetch('PATCH', `director/${user_id}`, data);
    },
    remove(user_id) {
        return _fetch('DELETE', `director/${user_id}`);
    },
    createMassive(data) {
        return _fetch('POST', `director/load`, data);
    },
});
