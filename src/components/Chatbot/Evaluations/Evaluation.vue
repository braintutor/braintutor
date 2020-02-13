<template>
  <div class="evaluation-container m-fullscreen">
    <div class="evaluation-menu">
      <v-btn icon @click="unselectEvaluation()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="evaluation-description">
        <span class="evaluation-title">{{evaluation_selected.nombre}}</span>
        <div class="evaluation-level">{{evaluation_selected.nivel}}</div>
      </div>
    </div>
    <div class="m-fullscreen-content">
      <div class="evaluation-time">
        <v-progress-circular
          class="question-time"
          :rotate="270"
          :size="42"
          :width="3"
          :value="time_percentage"
          color="primary"
        >{{ time_remaining }}</v-progress-circular>
      </div>
      <div class="question-container">
        <div class="question-text">{{question.enunciado}}</div>
        <div class="row no-gutters">
          <div
            class="col-12 col-md-6 pa-2"
            v-for="(alternative, a_idx) in question.alternativas"
            :key="a_idx"
          >
            <div class="question-alternative transform-scale m-fullcenter">{{alternative}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createTimer } from "@/services/timer";

export default {
  props: ["evaluation_selected", "unselectEvaluation"],
  data: () => ({
    question_idx: 0,
    time_remaining: 0,
    time_total: 0
  }),
  mounted() {
    // this.time_total = this.evaluation_selected.tiempo;
    this.time_total = 10;
    this.time_remaining = this.time_total;
    // Timer
    this.$store.commit("clearTimer", timer);
    let timer = createTimer(
      this.time_total,
      () => this.time_remaining--,
      // () => this.unselectEvaluation()
      () => {}
    );
    this.$store.commit("setTimer", timer);
  },
  computed: {
    question() {
      return this.evaluation_selected.preguntas[this.question_idx];
    },
    time_percentage() {
      return ((this.time_total - this.time_remaining) / this.time_total) * 100;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.evaluation-container {
  position: relative;
  .evaluation-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    .evaluation-description {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .evaluation-title {
        margin: 0 12px;
        font-size: calc(9.5px + 1vw);
        font-weight: bold;
      }
      .evaluation-level {
        padding: 2px 10px;
        background: #ebbb6b;
        color: #fff;
        border-radius: 10px;
        font-size: calc(8px + 0.8vw);
      }
    }
  }
}
.evaluation-time {
  width: max-content;
  margin: 0 auto 14px;
  font-size: 14px;
}
.question-container {
  padding: 20px;
  margin: 20px;
  margin-top: 5px;
  border-radius: 10px;
  @include box-shadow;
  .question-text {
    margin: 5px 0 18px 0;
    font-size: calc(10px + 1vw);
    text-align: center;
  }
  .question-alternative {
    height: 100%;
    padding: 10px 20px;
    font-size: calc(10px + 0.65vw);
    border-radius: 10px;
    @include box-shadow;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>