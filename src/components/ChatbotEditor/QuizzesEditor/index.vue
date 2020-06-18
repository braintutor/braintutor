<template>
  <div v-if="!quiz">
    <loading :active="loading" :message="loading_msg" />
    <!-- Material List -->
    <v-container v-for="(material, idx) in materials" :key="idx" fluid class="material">
      <p class="material__title">{{material.name}}</p>
      <v-row no-gutters>
        <v-col
          cols="6"
          sm="4"
          md="3"
          v-for="(quiz, r_idx) in material.quizzes"
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
        <v-col cols="6" sm="4" md="3" class="quiz-container">
          <div class="create-container" @click="createQuiz(material._id.$oid)">
            <v-icon>mdi-plus</v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
  <!-- Quiz Selected -->
  <QuizEditor
    v-else
    :quiz="quiz"
    :unselectQuiz="unselectQuiz"
    :deleteQuiz="deleteQuiz"
    :restoreQuizzes="restoreQuizzes"
  />
</template>

<script>
import Card from "@/components/Card";
import QuizEditor from "./QuizEditor";
import loading from "@/components/loading";

import { getMaterials } from "@/services/materialService";
import {
  getQuizzesByMaterial,
  addQuiz,
  removeQuiz
} from "@/services/quizService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    materials: [],
    quiz: null,
    chatbot_id: "",
    //
    loading: true,
    loading_msg: ""
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
      this.loading = true;
      this.loading_msg = "Cargando Materiales";
      this.materials = await getMaterials(this.chatbot_id);

      this.loading_msg = "Cargando Pruebas";
      for (let material of this.materials) {
        material.quizzes = await getQuizzesByMaterial(material._id.$oid);
      }

      this.loading = false;
    },
    async createQuiz(material_id) {
      this.loading = true;
      this.loading_msg = "Creando";

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
      let quiz_id = await addQuiz(material_id, new_quiz);
      new_quiz._id = quiz_id;
      this.materials
        .find(m => m._id.$oid === material_id)
        .quizzes.push(new_quiz);
      this.selectQuiz(new_quiz);

      this.loading = false;
    },
    async deleteQuiz(quiz_id) {
      this.quiz = null;
      this.loading = true;
      this.loading_msg = "Eliminando";
      await removeQuiz(quiz_id);
      await this.restoreQuizzes();
    },
    selectQuiz(quiz) {
      this.quiz = quiz;
    }
    // async restoreQuiz(quiz_id) {
    //   await this.restoreQuizzes();
    //   this.quiz = this.quizzes.find(quiz => quiz._id.$oid == quiz_id);
    // }
  },
  components: {
    Card,
    QuizEditor,
    loading
  }
};
</script>

<style lang="scss" scoped>
.material {
  padding: 0;
  margin-bottom: 24px;
  // border: 1px solid #ccc;

  &__title {
    font-weight: bold;
    font-size: 1.1rem;
    margin: 2px 10px;
  }
}

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
</style>