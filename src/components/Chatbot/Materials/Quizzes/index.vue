<template>
  <!-- Quiz List -->
  <v-container class="pa-0" v-if="!quiz_selected" fluid>
    {{quizzes}}
    <!-- <v-row no-gutters>
      <v-col cols="6" md="4" v-for="(quiz, e_idx) in quizzes" :key="e_idx" class="pa-2">
        <Card :callback="() => selectQuiz(quiz)">
          <p class="card-item">{{quiz.name}}</p>
          <p class="card-value">{{quiz.content.length}} pregunta(s)</p>
          <p class="card-value">{{quiz.time}} segundos</p>
          <p class="card-value">{{quiz.level}}</p>
          <p
            class="card-value result"
            v-if="quiz.result"
          >Máx. Puntaje: {{calculate(quiz.result) || '00'}}</p>
        </Card>
      </v-col>
    </v-row> -->
    <p class="text-center mt-2" v-show="quizzes.length === 0">No hay quizzes</p>
  </v-container>
  <!-- Quiz Selected -->
  <Quiz
    v-else
    :quiz="quiz_selected"
    :unselectQuiz="unselectQuiz"
    :setResult="setResult"
    :calculate="calculate"
  />
</template>

<script>
// import Card from "@/components/Card";
import Quiz from "./Quiz";

import { copy } from "@/services/object.js";
import { getQuizResultByStudent } from "@/services/quizService";

export default {
  props: ["quizzes"],
  data: () => ({
    quiz_selected: null
  }),
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  async mounted() {
    if (this.user.type == 2 || this.user.type == 4) {
      // student
      for (let quiz of this.quizzes) {
        quiz.result = await getQuizResultByStudent(quiz._id.$oid);
      }
      this.quizzes.splice();
    }
  },
  methods: {
    setResult(quiz_id, result) {
      let quiz = this.quizzes.find(quiz => quiz._id.$oid === quiz_id);
      quiz.result = result;
      this.quizzes.splice();
    },
    selectQuiz(quiz) {
      this.quiz_selected = copy(quiz);
    },
    unselectQuiz() {
      this.quiz_selected = null;
    },
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      score = ("0" + score).slice(-2);
      return score;
    }
  },
  components: {
    Quiz
    // Card
  }
};
</script>

<style lang='scss' scoped>
$color-evaluation: #e5c280;

.result {
  background: $color-evaluation;
  color: #fff;
  font-weight: bold;
}
</style>