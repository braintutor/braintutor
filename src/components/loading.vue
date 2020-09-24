<template>
  <div class="loading" :class="{ active: active }">
    <v-progress-circular
      :width="3"
      :size="80"
      indeterminate
      color="var(--color-subtitle)"
    ></v-progress-circular>
    <p class="loading__message">
      <span v-if="message">{{ message }}</span>
      <span v-else style="opacity: 0">...</span>
    </p>
  </div>
</template>

<script>
export default {
  props: ["active", "message"],
};
</script>

<style lang='scss' scoped>
.loading {
  position: fixed;
  top: 56px;
  left: 0;
  height: 100vh;
  width: 100vw;
  //
  background: rgba(255, 255, 255, 0);
  pointer-events: none;
  opacity: 0;
  z-index: var(--z-loading) !important;
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