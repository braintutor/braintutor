<template>
  <section
    class="evaluation m-card"
    :class="{'levitation': !disabled}"
    @click="$emit('click', $event)"
  >
    <v-progress-linear :value="progress" :height="4" color="var(--color-subtitle)"></v-progress-linear>

    <div class="m-card__body">
      <p class="evaluation__name">{{name}}</p>
      <div class="evaluation__body">
        <span class="evaluation__label">Tiempo Inicio</span>
        <span class="evaluation__label">Tiempo Fin</span>
        <span v-if="student" class="evaluation__label">Estado</span>
        <span v-else class="evaluation__label">N° de preguntas</span>
        <p class="evaluation__time">{{toDateTimeString(new Date(time_start), false)}}</p>
        <p class="evaluation__time">{{toDateTimeString(new Date(time_end), false)}}</p>
        <p v-if="student" class="evaluation__time">
          <span v-if="state" class="evaluation__state1">Completado</span>
          <span v-else class="evaluation__state0">Sin Realizar</span>
        </p>
        <p v-else class="evaluation__time">{{size}} pregunta(s)</p>
      </div>
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
            <v-icon style="font-size: 1.5rem">{{button.icon}}</v-icon>
          </m-btn>
        </template>
        <span style="font-size: .75rem">{{button.text}}</span>
      </v-tooltip>
    </div>
  </section>
</template>

<script>
import { toDateTimeString } from "@/services/date";

export default {
  props: {
    name: String,
    time_start: null,
    time_end: null,
    size: Number,
    buttons: Array,
    state: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
    student: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    now: new Date(),
  }),
  computed: {
    progress() {
      let time_start = new Date(this.time_start);
      let time_end = new Date(this.time_end);

      var dif_total = time_end.getTime() - time_start.getTime();
      var dif_current = this.now.getTime() - time_start.getTime();

      if (dif_current < 0) return 0;
      if (dif_current > dif_total) return 100;

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
    padding: 8px 0;
    // background: rgb(244, 246, 253);
    border-radius: 12px;

    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 8px;
    row-gap: 8px;
  }
  &__actions {
    justify-content: center;
  }

  &__label {
    color: var(--color-subtitle);
    font-weight: bold;
    font-size: 0.85rem;
    text-align: center;
  }
  &__time {
    color: rgb(47, 47, 47);
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: bold;
    text-align: center;
  }
  &__state0 {
    color: var(--color-font-disable);
  }
  &__state1 {
    padding: 6px 18px;
    background: var(--color-subtitle);
    color: #fff;
    border-radius: 12px;
  }
}
</style>