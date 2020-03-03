<template>
  <!-- Quiz List -->
  <v-container v-if="!quiz_selected" fluid>
    <v-row no-gutters>
      <v-col
        cols="6"
        md="3"
        lg="2"
        v-for="(quiz, e_idx) in quizzes"
        :key="e_idx"
        class="pa-2"
      >
        <Cartel
          :description="quiz.name"
          :image="'https://www.nxdirectatl.com/wp-content/uploads/2017/01/47380846-orange-wallpaper.png'"
          :callback="() => selectQuiz(quiz)"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- Quiz Selected -->
  <Quiz
    v-else
    :quiz="quiz_selected"
    :unselectQuiz="unselectQuiz"
  />
</template>

<script>
import Cartel from "@/components/Cartel";
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
  mounted() {
    let chatbot_id = getParam("chatbot_id");
    getQuizzes(chatbot_id).then(res => {
      this.quizzes = res;
    });
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
    Cartel,
    Quiz
  }
};
</script>

<style lang='scss' scoped>
</style>