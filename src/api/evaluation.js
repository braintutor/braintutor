export default (_fetch) => ({
  update(id, time_end) {
    return _fetch('PATCH', 'evaluation', {
      id, time_end
    });
  },
});
