<template>
  <div class="footer-container">
    <div class="footer-content m-container-plus">
      <span>Diseñado por</span>
      <span class="footer-author">Mitsuo</span>
      <span class="mx-4"> Version {{ version }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    version: process.env.VUE_APP_VERSION
  }),
};
</script>

<style lang="scss" scoped>
.footer-container {
  background: #212a2f;
  color: #fff;
  .footer-content {
    padding: 16px 20px;
    font-weight: lighter;
    font-size: 1rem;
    .footer-author {
      margin-left: 6px;
      font-weight: bold;
      font-size: 1rem;
    }
  }
}
</style>
