export default (_fetch) => ({
  getAll(room_id, to_id) {
    return _fetch('GET', `message/${room_id}?to_id=${to_id}`);
  },
  add(room_id, message, to_id) {
    return _fetch('POST', `message/${room_id}`, { message, to_id });
  },
});
