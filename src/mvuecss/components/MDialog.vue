<template>
  <div :class="classes" v-on="inputListeners" @click="clickOutside()">
    <div
      class="m-dialog__body"
      :class="{'m-dialog__body--animated': this.animated}"
      :style="{'width': `${width}px`}"
      @click="$event.stopPropagation()"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  // TODO add prop width
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [Number, String],
      default: 400,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    animated: false,
    animation_time: 400,
  }),
  computed: {
    classes() {
      return {
        "m-dialog": true,
        "m-dialog--disabled": !this.value,
        "m-dialog--fullscreen": this.fullscreen,
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
  methods: {
    clickOutside() {
      if (this.persistent) {
        this.animated = true;
        setTimeout(() => {
          this.animated = false;
        }, this.animation_time);
      } else this.$emit("input", false);
    },
  },
};
</script>