<template>
  <button
    :class="[classname, `${classname}--${color}`, small && `${classname}--small`, loading && `${classname}--loading`, block && `${classname}--block`]"
    @click="onClick"
  >
    <span>
      <slot></slot>
    </span>
    <span v-show="loading" :class="`${classname}__loader`"></span>
  </button>
</template>

<script>
export default {
  props: {
    color: String,
    small: Boolean,
    loading: Boolean,
    block: Boolean,
  },
  data: () => ({
    classname: "m-btn",
  }),
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style>
</style>