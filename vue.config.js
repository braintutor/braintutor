module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/braintutor/'
    : '/',
  "transpileDependencies": [
    "vuetify"
  ]
}