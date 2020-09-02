<template>
  <section :class="classes">
    <span>
      <slot></slot>
    </span>
    <svg
      @click="$emit('input', false)"
      class="m-alert__icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 36"
    >
      <path fill="none" d="M0 0 36 36 M36 0 0 36" />
    </svg>
  </section>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: "primary",
    },
  },
  computed: {
    classes() {
      return {
        "m-alert": true,
        "m-alert--disabled": !this.value,
        [`m-alert--${this.color}`]: true,
        "m-alert--small": this.small,
      };
    },
  },
};
</script>