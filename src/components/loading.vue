<template>
  <div class="loading" :class="{active: active}">
    <v-progress-circular :width="3" :size="60" indeterminate color="green"></v-progress-circular>
  </div>
</template>

<script>
export default {
  props: ["active"]
};
</script>

<style lang='scss' scoped>
.loading {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  //
  background: #fff;
  pointer-events: none;
  opacity: 0;
  z-index: 2;
  transition: opacity 0.3s;
  //
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    pointer-events: initial;
    opacity: 0.5;
  }
}
</style>