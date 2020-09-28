export default (fetch_get) => ({
  getAll() {
    return fetch_get("classroom");
  },
});
