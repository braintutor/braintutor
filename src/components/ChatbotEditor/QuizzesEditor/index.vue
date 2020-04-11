<template>
  <div>
    <loading :active="loading_quizzes" :message="loading_message" />
    <!-- Quiz List -->
    <v-container v-if="!quiz" fluid class="quizzes-container">
      <v-row no-gutters>
        <v-col
          cols="6"
          sm="4"
          md="2"
          v-for="(quiz, r_idx) in quizzes"
          :key="r_idx"
          class="quiz-container"
        >
          <Card :callback="() => selectQuiz(quiz)">
            <p class="card-item">{{quiz.name}}</p>
            <p class="card-value">{{quiz.content.length}} pregunta(s)</p>
            <p class="card-value">{{quiz.time}} segundos</p>
            <p class="card-value">{{quiz.level}}</p>
          </Card>
        </v-col>
        <v-col cols="6" sm="4" md="2" class="quiz-container">
          <div class="create-container" @click="createQuiz()">
            <v-icon>mdi-plus</v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- Quiz Selected -->
    <QuizEditor
      v-else
      :quiz="quiz"
      :unselectQuiz="unselectQuiz"
      :deleteQuiz="deleteQuiz"
      :restoreQuiz="restoreQuiz"
      :restoreQuizzes="restoreQuizzes"
    />
  </div>
</template>

<script>
import Card from "@/components/Card";
import QuizEditor from "./QuizEditor";
import loading from "@/components/loading";

import { getQuizzes, addQuiz, removeQuiz } from "@/services/quizService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    quizzes: [],
    quiz: null,
    chatbot_id: "",
    //
    loading_quizzes: true,
    loading_message: ""
  }),
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.restoreQuizzes();
  },
  methods: {
    unselectQuiz() {
      this.quiz = null;
    },
    async restoreQuizzes() {
      this.loading_quizzes = true;
      this.loading_message = "Cargando Pruebas";
      this.quizzes = await getQuizzes(this.chatbot_id);
      this.loading_quizzes = false;
    },
    async createQuiz() {
      this.loading_quizzes = true;
      let new_quiz = {
        name: "Nombre",
        level: "Básico",
        time: 60,
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa 1", "Alternativa 2"],
            correct: 0
          }
        ]
      };
      let quiz_id = await addQuiz(this.chatbot_id, new_quiz);
      new_quiz._id = quiz_id;
      this.quizzes.push(new_quiz);
      this.selectQuiz(new_quiz);
      this.loading_quizzes = false;
    },
    async deleteQuiz(quiz_id) {
      this.quiz = null;
      this.loading_quizzes = true;
      await removeQuiz(quiz_id);
      await this.restoreQuizzes();
    },
    selectQuiz(quiz) {
      this.quiz = quiz;
    },
    async restoreQuiz(quiz_id) {
      await this.restoreQuizzes();
      this.quiz = this.quizzes.find(quiz => quiz._id.$oid == quiz_id);
    }
  },
  components: {
    Card,
    QuizEditor,
    loading
  }
};
</script>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: -20px;
  left: 0;
  background: #fff;
  opacity: 0;
  z-index: 1;
  transition: opacity 1s;
  pointer-events: none;
  //
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    pointer-events: initial;
    opacity: 0.85;
  }
}
.quizzes-container {
  padding: 0;
  .quiz-container {
    padding: 8px;
  }
  .create-container {
    height: 100%;
    min-height: 160px;
    border: 2px solid #c2c2c2;
    border-style: dashed;
    border-radius: 10px;
    transition: all 0.3s;
    //
    display: flex;
    justify-content: center;
    & * {
      color: #c2c2c2;
      font-size: 40px !important;
    }
    &:hover {
      cursor: pointer;
      background: #eeeeee;
    }
  }
}
</style>