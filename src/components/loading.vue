<template>
  <div class="loading" :class="{active: active}">
    <v-progress-circular :width="3" :size="80" indeterminate color="green"></v-progress-circular>
    <p class="loading__message">{{message}}</p>
  </div>
</template>

<script>
export default {
  props: ["active", "message"]
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
  background: rgba(255, 255, 255, 0);
  pointer-events: none;
  opacity: 0;
  z-index: 2;
  transition: all 0.3s;
  //
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  &.active {
    pointer-events: initial;
    background: rgba(255, 255, 255, 0.8);
    opacity: 1;
  }
  &__message {
    margin-top: 30px;
    color: #7c7c7c;
    font-size: 1.1rem;
    font-weight: bold;
  }
}
</style>