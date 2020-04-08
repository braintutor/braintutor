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
        </Card>
      </v-col>
    </v-row>
  </v-container>
  <!-- Quiz Selected -->
  <Quiz v-else :quiz="quiz_selected" :unselectQuiz="unselectQuiz" />
</template>

<script>
import Card from "@/components/Card";
import Quiz from "./Quiz";

import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
import { getQuizzes } from "@/services/quizService";

export default {
  props: ["showServices"],
  data: () => ({
    quizzes: [],
    quiz_selected: null
  }),
  async mounted() {
    let chatbot_id = getParam("chatbot_id");
    this.quizzes = await getQuizzes(chatbot_id);
  },
  methods: {
    selectQuiz(quiz) {
      this.quiz_selected = copy(quiz);
      this.showServices(false);
    },
    unselectQuiz() {
      this.quiz_selected = null;
      this.showServices(true);
    }
  },
  components: {
    Quiz,
    Card
  }
};
</script>

<style lang='scss' scoped>
.list {
  padding-bottom: 70px;
}
</style>