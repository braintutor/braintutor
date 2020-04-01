<template>
  <div class="quiz-editor-container m-fullscreen">
    <loading :active="loading" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="loadQuizzes()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field class="menu-title" v-model="quiz.name" dense hide-details autocomplete="off"></v-text-field>
      </div>
      <div class="menu-right">
        <v-btn icon @click="addQuestion(quiz.content)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon @click="restoreQuiz(quiz._id.$oid)">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <v-btn icon @click="saveQuiz()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_delete = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Quiz Content -->
    <div id="quiz-scroll" class="quiz-editor-content m-fullscreen-content">
      <div class="question-editor-text mb-3">
        <v-select v-model="quiz.level" :items="levels" label="Nivel"></v-select>
        <v-slider v-model="quiz.time" :label="`Tiempo: ${quiz.time}s`" min="10" max="600" step="10"></v-slider>
      </div>
      <div v-for="(c, c_idx) in quiz.content" :key="c_idx" class="question-editor-container">
        <div class="question-editor-question question-editor-text">
          <v-textarea v-model="c.question" :rows="1" autoGrow dense hide-details></v-textarea>
          <v-btn v-if="quiz.content.length > 1" icon @click="removeQuestion(quiz.content, c_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
        <v-radio-group v-model="c.correct">
          <div class="row no-gutters">
            <div
              class="question-editor-alternative-container col-12 col-md-6"
              v-for="(alternative, a_idx) in c.alternatives"
              :key="a_idx"
            >
              <div class="question-editor-alternative-content question-editor-text">
                <v-textarea style="width: 0" v-model="c.alternatives[a_idx]" :rows="1" autoGrow dense hide-details></v-textarea>
                <v-btn
                  v-if="c.alternatives.length > 2"
                  icon
                  @click="removeAlternative(c.alternatives, a_idx)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
              <v-radio :value="a_idx"></v-radio>
            </div>
            <div class="question-editor-alternative-container col-12 col-md-6">
              <div
                class="question-editor-alternative-add m-fullcenter"
                @click="addAlternative(c.alternatives)"
              >
                <v-icon>mdi-plus</v-icon>
              </div>
            </div>
          </div>
        </v-radio-group>
      </div>
    </div>

    <!-- Dialog -->
    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina este contenido, no podrá revertir los cambios.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn small depressed color="error" @click="deleteQuiz(quiz._id.$oid)">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { scrollDown } from "@/services/scroll";
import { updateQuiz } from "@/services/quizService";

export default {
  props: [
    "quiz",
    "unselectQuiz",
    "restoreQuizzes",
    "deleteQuiz",
    "restoreQuiz"
  ],
  data: () => ({
    levels: ["Básico", "Intermedio", "Avanzado"],
    loading: false,
    dialog_delete: false
  }),
  methods: {
    loadQuizzes() {
      this.unselectQuiz();
      this.restoreQuizzes();
    },
    async saveQuiz() {
      this.loading = true;
      this.quiz.id = this.quiz._id.$oid;
      await updateQuiz(this.quiz);
      this.loading = false;
    },
    addQuestion(questions) {
      questions.push({
        question: "Pregunta",
        alternatives: ["Alternativa 1", "Alternativa 2"],
        correct: 0
      });
      setTimeout(() => {
        scrollDown("quiz-scroll");
      }, 100);
    },
    removeQuestion(questions, question_idx) {
      questions.splice(question_idx, 1);
    },
    addAlternative(alternatives) {
      alternatives.push("Alternativa");
    },
    removeAlternative(alternatives, alternative_idx) {
      alternatives.splice(alternative_idx, 1);
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";
.quiz-editor-container {
  .quiz-editor-content {
    padding: 8px 20px;
    .question-editor-text {
      & * {
        margin: 0;
        font-size: 1rem !important;
      }
    }
    .question-editor-container {
      padding: 10px 5px 10px 5px;
      margin-bottom: 16px;
      border-radius: 10px;
      @include box-shadow;
      .question-editor-question {
        padding: 10px 10px 5px 10px;
        display: flex;
      }
      .question-editor-alternative-container {
        display: flex;
        padding: 6px 10px;
        .question-editor-alternative-content {
          flex-grow: 1;
          margin-right: 10px;
          height: 100%;
          padding: 10px 10px 8px 10px;
          border-radius: 10px;
          @include box-shadow;
          display: flex;
        }
        .question-editor-alternative-add {
          flex-grow: 1;
          margin-right: 34px;
          min-height: 50px;
          border: 2px solid #c2c2c2;
          border-style: dashed;
          border-radius: 10px;
          transition: all 0.3s;
          &:hover {
            cursor: pointer;
            background: #eeeeee;
          }
        }
      }
    }
  }
}
</style>