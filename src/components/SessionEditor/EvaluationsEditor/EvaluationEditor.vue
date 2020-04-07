<template>
  <div class="quiz-editor-container m-fullscreen">
    <loading :active="loading" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect(); getEvaluations()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          class="menu-title"
          v-model="evaluation.name"
          dense
          hide-details
          autocomplete="off"
        ></v-text-field>
      </div>
      <div class="menu-right">
        <v-btn icon @click="addQuestion(evaluation.content)">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon @click="save()">
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
        <v-slider
          v-model="evaluation.time"
          :label="`Tiempo: ${evaluation.time}s`"
          min="10"
          max="600"
          step="10"
        ></v-slider>
      </div>
      <div
        v-for="(c, c_idx) in evaluation.content"
        :key="c_idx"
        class="question-editor-container m-card"
      >
        <div class="question-editor-question question-editor-text">
          <v-textarea v-model="c.question" :rows="1" autoGrow dense hide-details></v-textarea>
          <v-btn
            v-if="evaluation.content.length > 1"
            icon
            @click="removeQuestion(evaluation.content, c_idx)"
          >
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
              <div class="question-editor-alternative-content question-editor-text m-card">
                <v-textarea
                  style="width: 0"
                  v-model="c.alternatives[a_idx]"
                  :rows="1"
                  autoGrow
                  dense
                  hide-details
                ></v-textarea>
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
          <v-btn small depressed color="error" @click="dialog_delete = false; remove()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { scrollDown } from "@/services/scroll";
import {
  updateEvaluation,
  deleteEvaluation
} from "@/services/evaluationService";

export default {
  props: ["evaluation", "getEvaluations", "unselect"],
  data: () => ({
    loading: false,
    dialog_delete: false
  }),
  methods: {
    async save() {
      this.loading = true;
      this.evaluation.id = this.evaluation._id.$oid;
      await updateEvaluation(this.evaluation);
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      let evaluation_id = this.evaluation._id.$oid;
      await deleteEvaluation(evaluation_id);
      this.getEvaluations();
      this.unselect();
      this.loading = false;
    },
    addQuestion(questions) {
      questions.push({
        question: "Pregunta",
        alternatives: ["Alternativa 1", "Alternativa 2"],
        correct: 0
      });
      setTimeout(() => {
        scrollDown();
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