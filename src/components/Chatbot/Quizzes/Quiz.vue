<template>
  <div class="quiz-container m-fullscreen">
    <div class="quiz-menu">
      <v-btn icon @click="unselectQuiz()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="quiz-description">
        <span class="quiz-title">{{quiz.name}}</span>
        <div class="quiz-level">{{quiz.level}}</div>
      </div>
    </div>
    <div v-if="!show_score" class="m-fullscreen-content">
      <div class="quiz-time">
        <v-progress-circular
          :rotate="270"
          :size="42"
          :width="3"
          :value="time_percentage"
          color="primary"
        >{{ time_remaining }}</v-progress-circular>
      </div>
      <div class="question-container">
        <div class="question-text">{{question_selected.question}}</div>
        <div class="row no-gutters">
          <div
            class="question-alternative-container col-12 col-md-6"
            v-for="(alternative, a_idx) in question_selected.alternatives"
            :key="a_idx"
          >
            <div
              class="question-alternative-content transform-scale m-fullcenter"
              :class="{'question-alternative-correct': question_selected.show_correct && question_selected.correct === a_idx,'question-alternative-incorrect': question_selected.incorrect === a_idx}"
              @click="selectAlternative(question_selected, question_selected.correct, a_idx)"
            >{{alternative}}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="score-container m-fullscreen-content">
      <v-progress-circular
        :rotate="270"
        :size="180"
        :width="10"
        :value="score"
        color="primary"
      >{{`${this.corrects}/${this.total_questions}`}}</v-progress-circular>
      <div class="score-content">
        <span>{{score_message}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { createTimer } from "@/services/timer";
import { percentage } from "@/services/math";

export default {
  props: ["quiz", "unselectQuiz"],
  data: () => ({
    question_idx: 0,
    time_remaining: 0,
    time_total: 0,
    //
    total_questions: 0,
    score: 0,
    corrects: 0,
    //
    time_transition: 1000,
    show_score: false
  }),
  computed: {
    question_selected() {
      return this.quiz.content[this.question_idx];
    },
    time_percentage() {
      return 100 - percentage(this.time_total, this.time_remaining);
    },
    component_avatar() {
      return this.$store.state.component_avatar;
    },
    score_message() {
      return `Has acertado ${this.corrects} de ${this.total_questions} preguntas.`;
    }
  },
  mounted() {
    this.total_questions = this.quiz.content.length;
    this.time_total = this.quiz.time;
    this.time_remaining = this.time_total;
    // Timer
    this.clearTimer();
    let timer = createTimer(
      this.time_total,
      () => this.time_remaining--,
      () => this.showScore()
    );
    this.$store.commit("setTimer", timer);
  },
  methods: {
    selectAlternative(question, correct_idx, alternative_idx) {
      if (!question.show_correct) {
        question.show_correct = true;
        if (correct_idx === alternative_idx) {
          this.corrects++;
          this.startTalk("respuesta correcta");
        } else {
          question.incorrect = alternative_idx;
          this.startTalk("respuesta incorrecta");
        }
        setTimeout(() => {
          if (this.total_questions > this.question_idx + 1) {
            this.question_idx++;
          } else {
            this.showScore();
          }
        }, this.time_transition);
        this.$forceUpdate(); /* Correct Binding Update (:class) */
      }
    },
    showScore() {
      this.clearTimer();
      this.show_score = true;
      setTimeout(() => {
        this.score = percentage(this.total_questions, this.corrects);
        // this.startTalk(this.score_message);
      }, 500);
    },
    //
    clearTimer() {
      this.$store.commit("clearTimer");
    },
    startTalk(text) {
      this.component_avatar.startTalk(text);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.quiz-container {
  position: relative;
  .quiz-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    .quiz-description {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .quiz-title {
        margin: 0 12px;
        font-size: 1.5rem;
        font-weight: bold;
      }
      .quiz-level {
        padding: 2px 10px;
        background: #ebbb6b;
        color: #fff;
        border-radius: 10px;
        font-size: 1rem;
      }
    }
  }
  .quiz-time {
    width: max-content;
    margin: 0 auto 14px;
    font-size: 14px;
  }
}
.question-container {
  padding: 16px 10px;
  margin: 20px;
  margin-top: 5px;
  border-radius: 10px;
  @include box-shadow;
  .question-text {
    margin: 5px 0 18px 0;
    font-size: 1.2rem;
    text-align: center;
  }
  .question-alternative-container {
    padding: 5px 10px;
    .question-alternative-content {
      height: 100%;
      padding: 10px 20px;
      font-size: 1rem;
      border-radius: 10px;
      @include box-shadow;
      &:hover {
        cursor: pointer;
      }
      &.question-alternative-correct {
        background: #8bc34a;
        color: #fff;
        font-weight: bold;
      }
      &.question-alternative-incorrect {
        background: #ff887f;
        color: #fff;
        font-weight: bold;
      }
    }
  }
}
.score-container {
  padding: 30px;
  font-size: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  .score-content {
    font-size: 1.8rem;
    margin-top: 32px;
  }
}
</style>