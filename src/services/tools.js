function redirect(name) {
  this.$router.push({ name }).catch(() => { })
}

export { redirect }