<template>
  <button :class="classes" v-on="inputListeners">
    <span>
      <slot></slot>
    </span>
    <span v-show="loading" class="m-btn__loader"></span>
  </button>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return {
        "m-btn": true,
        [`m-btn--${this.color}`]: true,
        "m-btn--small": this.small,
        "m-btn--loading": this.loading,
        "m-btn--text": this.text,
        "m-btn--block": this.block,
        "m-btn--rounded": this.rounded,
        "m-btn--disabled": this.disabled,
        "m-btn--icon": this.icon,
      };
    },
    // Source: https://es.vuejs.org/v2/guide/components-custom-events.html
    inputListeners() {
      var vm = this;
      // `Object.assign` merges objects together to form a new object
      var listeners = Object.assign(
        {},
        // We add all the listeners from the parent
        this.$listeners,
        // Then we can add custom listeners or override the
        // behavior of some listeners.
        {
          // This ensures that the component works with v-model
          input: function (event) {
            vm.$emit("input", event.target.value);
          },
        }
      );
      return listeners;
    },
  },
};
</script>