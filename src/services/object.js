function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

export { copy }