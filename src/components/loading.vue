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
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  //
  background: #fff;
  pointer-events: none;
  opacity: 0;
  z-index: 2;
  transition: opacity .4s;
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