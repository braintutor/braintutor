<template>
  <div class="menu">
    <div class="menu__left">
      <v-btn small icon @click="back()">
        <v-icon style="font-size: 1.5rem">mdi-arrow-left</v-icon>
      </v-btn>
      <span class="menu__title">{{title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "back"]
};
</script>

<style lang='scss' scoped>
.menu {
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &__title {
    margin: 0 8px !important;
    margin-top: 2px !important;
    font-size: 1.1rem;
    font-weight: bold;
  }
  &__left {
    display: flex;
    align-items: center;
  }
  &__right {
  }
}
</style>