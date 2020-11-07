export default (_fetch) => ({
    get(material_id) {
        return _fetch('GET', `report/${material_id}`);
    },
    update(data) {
        return _fetch('PATCH', `report`, data);
    },
});
