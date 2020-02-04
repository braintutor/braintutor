function redirect(name) {
  if (this.$router.history.current.name != name)
    this.$router.push({ name });
}

export { redirect }