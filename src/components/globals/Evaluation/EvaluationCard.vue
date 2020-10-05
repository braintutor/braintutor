<template>
  <section class="evaluation m-card" @click="$emit('click', $event)">
    <v-progress-linear
      :value="progress"
      :height="4"
      color="#84b5ff"
    ></v-progress-linear>

    <div class="m-card__body">
      <p class="evaluation__name">{{ name }}</p>
      <div class="evaluation__body">
        <div class="evaluation__item">
          <span class="evaluation__label">Tiempo Inicio</span>
          <p class="evaluation__value">
            {{ toDateTimeString(time_start, false) }}
          </p>
        </div>
        <div class="evaluation__item">
          <span class="evaluation__label">Tiempo Fin</span>
          <p class="evaluation__value">
            {{ toDateTimeString(time_end, false) }}
          </p>
        </div>
        <div v-for="(item, idx) in items" :key="idx" class="evaluation__item">
          <span class="evaluation__label">{{ item.label }}</span>
          <p class="evaluation__value">
            {{ item.value }}
          </p>
        </div>
      </div>

      <slot></slot>
    </div>

    <div v-if="buttons" class="evaluation__actions m-card__actions">
      <v-tooltip v-for="(button, idx) in buttons" :key="idx" bottom>
        <template v-slot:activator="{ on }">
          <m-btn
            v-on="on"
            @click="button.action"
            :color="button.color"
            :disabled="button.disabled"
            small
            text
            class="mx-1"
          >
            <v-icon style="font-size: 1.5rem">{{ button.icon }}</v-icon>
          </m-btn>
        </template>
        <span style="font-size: 0.75rem">{{ button.text }}</span>
      </v-tooltip>
    </div>
  </section>
</template>

<script>
import { toDateTimeString } from "@/services/date";

export default {
  props: {
    value: Number,
    name: String,
    time_start: Date,
    time_end: Date,
    items: Array,
    buttons: Array,
  },
  data: () => ({
    now: new Date(),
  }),
  computed: {
    progress() {
      var dif_total = this.time_end.getTime() - this.time_start.getTime();
      var dif_current = this.now.getTime() - this.time_start.getTime();

      if (dif_current < 0) {
        this.$emit("input", 1); // -1:past 0:current 1:future
        return 0;
      }
      if (dif_current > dif_total) {
        this.$emit("input", -1); // -1:past 0:current 1:future
        return 100;
      }

      this.$emit("input", 0); // -1:past 0:current 1:future

      return (dif_current * 100) / dif_total;
    },
  },
  // Resource: https://itnext.io/how-not-to-vue-18f16fe620b5
  created() {
    this.$options.interval = setInterval(() => {
      this.now = new Date();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.$options.interval);
  },
  methods: {
    toDateTimeString,
  },
};
</script>

<style lang='scss' scoped>
.evaluation {
  overflow: hidden;
  &__name {
    font-size: 1.3rem;
    font-weight: bold;
    text-align: center;
    word-wrap: break-word;
  }
  &__body {
    display: flex;
    justify-content: center;
  }
  &__item {
    padding: 0 5%;
    text-align: center;
  }
  &__label {
    color: var(--color-subtitle);
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
  }
  &__value {
    color: rgb(47, 47, 47);
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
  }
  &__actions {
    justify-content: center;
  }
}
</style>