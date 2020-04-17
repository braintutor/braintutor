<template>
  <!-- Quiz List -->
  <v-container class="list" v-if="!quiz_selected" fluid>
    <v-row no-gutters>
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
    </v-row>
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
import Card from "@/components/Card";
import Quiz from "./Quiz";

import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
getSession;
import { getQuizzes, getQuizResultByStudent } from "@/services/quizService";
import { getSession } from "@/services/security";

export default {
  props: ["showServices"],
  data: () => ({
    quizzes: [],
    quiz_selected: null
  }),
  async mounted() {
    let chatbot_id = getParam("chatbot_id");
    this.quizzes = await getQuizzes(chatbot_id);

    if (getSession().type == 2 || getSession().type == 4) { // student
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
      this.showServices(false);
    },
    unselectQuiz() {
      this.quiz_selected = null;
      this.showServices(true);
    },
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      score = ("0" + score).slice(-2);
      return score;
    }
  },
  components: {
    Quiz,
    Card
  }
};
</script>

<style lang='scss' scoped>
$color-evaluation: #e5c280;

.list {
  padding-bottom: 70px;
}
.result {
  background: $color-evaluation;
  color: #fff;
  font-weight: bold;
}
</style>