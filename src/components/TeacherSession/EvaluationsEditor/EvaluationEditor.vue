<template>
  <div class="quiz-editor-container m-fullscreen">
    <div class="m-menu">
      <div class="m-menu__left">
        <v-btn icon @click="unselect()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          v-if="!evaluation.public"
          class="m-menu__title"
          v-model="evaluation.name"
          :maxlength="EvaluationModel.name.max_length"
          :counter="EvaluationModel.name.max_length"
          dense
          autocomplete="off"
        ></v-text-field>
        <span v-else class="m-menu__title">{{ evaluation.name }}</span>
      </div>
      <div v-if="!evaluation.public" class="m-menu__right">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="addQuestion(evaluation.content)"
              :disabled="
                evaluation.content.length >= EvaluationModel.content.max_length
              "
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Agregar Pregunta</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="save()">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Guardar Cambios</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="dialog_delete = true">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Eliminar Evaluación</span>
        </v-tooltip>
      </div>
    </div>

    <!-- Quiz Content -->
    <div id="quiz-scroll" class="quiz-editor-content m-fullscreen-content">
      <div class="time-editor">
        <span>Tiempo de Inicio:</span>
        <input
          type="datetime-local"
          v-model="evaluation.time_start_f"
          :disabled="evaluation.public"
        />
        <span>Tiempo de Fin:</span>
        <input
          type="datetime-local"
          v-model="evaluation.time_end_f"
          :disabled="evaluation.public"
        />
      </div>
      <div
        v-for="(c, c_idx) in evaluation.content"
        :key="c_idx"
        class="question-editor-container m-card"
      >
        <div class="question-editor-question question-editor-text">
          <div v-if="!evaluation.public" class="question">
            <v-textarea
              v-model="c.question"
              :rows="1"
              :maxlength="QuestionModel.question.max_length"
              :counter="QuestionModel.question.max_length"
              autoGrow
              dense
            ></v-textarea>
            <v-btn @click="showFiles(c_idx)" icon>
              <v-icon>mdi-image</v-icon>
            </v-btn>
          </div>
          <span v-else>{{ c.question }}</span>
          <v-btn
            v-if="!evaluation.public && evaluation.content.length > 1"
            icon
            @click="removeQuestion(evaluation.content, c_idx)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
        <div v-if="c.image" class="question__image">
          <img :src="c.image" />
          <v-btn
            v-if="!evaluation.public"
            @click="
              c.image = null;
              $forceUpdate();
            "
            class="question__image-close"
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-radio-group v-model="c.correct">
          <div class="row no-gutters">
            <div
              class="question-editor-alternative-container col-12"
              v-for="(alternative, a_idx) in c.alternatives"
              :key="a_idx"
            >
              <div
                class="question-editor-alternative-content question-editor-text m-card"
              >
                <v-textarea
                  v-if="!evaluation.public"
                  style="width: 0"
                  v-model="c.alternatives[a_idx]"
                  :rows="1"
                  :maxlength="QuestionModel.alternative.max_length"
                  :counter="QuestionModel.alternative.max_length"
                  autoGrow
                  dense
                ></v-textarea>
                <span v-else>{{ c.alternatives[a_idx] }}</span>
                <v-btn
                  v-if="!evaluation.public && c.alternatives.length > 2"
                  icon
                  @click="removeAlternative(c.alternatives, a_idx)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
              <v-radio :disabled="evaluation.public" :value="a_idx"></v-radio>
            </div>
            <div
              v-if="
                !evaluation.public &&
                c.alternatives.length < QuestionModel.alternatives.max_length
              "
              class="question-editor-alternative-container col-12"
            >
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
      <div class="public">
        <m-btn
          v-if="!evaluation.public"
          @click="dialog_public = true"
          color="primary"
          small
          >Publicar</m-btn
        >
      </div>
    </div>

    <!-- Dialog Public -->
    <v-dialog v-model="dialog_public" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar publicación</h3>
          <p class="mt-4">
            Una vez publicada la evaluación, no podrá modificar su contenido.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dialog_public = false"
            color="primary"
            small
            text
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dialog_public = false;
              publicEvaluation();
            "
            color="primary"
            small
            >Publicar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- Dialog Delete -->
    <v-dialog v-model="dialog_delete" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dialog_delete = false"
            color="primary"
            small
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dialog_delete = false;
              remove();
            "
            color="error"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>

    <!-- DLG FILES -->
    <v-dialog v-model="dlg_files" max-width="1000">
      <Files
        v-if="dlg_files"
        document_type="session"
        :document_id="session_id"
        @file="onFileSelected"
        class="m-card pa-4"
      />
    </v-dialog>
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";

import { scrollDown } from "@/services/scroll";
import {
  updateEvaluationByTeacher,
  publicEvaluation,
  deleteEvaluation,
} from "@/services/evaluationService";
// import { toDateTimeString } from "@/services/date";

import EvaluationModel from "@/models/Evaluation";
import QuestionModel from "@/models/Question";

export default {
  props: ["evaluation", "unselect"],
  data: () => ({
    session_id: "",
    question_selected: -1,
    dialog_delete: false,
    dialog_public: false,
    dlg_files: false,
    EvaluationModel,
    QuestionModel,
  }),
  created() {
    this.session_id = this.$route.params["session_id"];

    let formatDate = (date) => {
      let date_f = new Date();
      date_f.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      date_f = date_f.toISOString().substring(0, 16);
      return date_f;
    };

    let { time_start, time_end } = this.evaluation;
    this.evaluation.time_start_f = formatDate(time_start);
    this.evaluation.time_end_f = formatDate(time_end);
    this.$forceUpdate();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      this.evaluation.id = this.evaluation._id;
      this.evaluation.time_start = new Date(this.evaluation.time_start_f);
      this.evaluation.time_end = new Date(this.evaluation.time_end_f);
      try {
        await updateEvaluationByTeacher(this.evaluation);
        this.hideLoading();
        return true;
      } catch (error) {
        this.showMessage("", error.msg || error);
        this.hideLoading();
        return false;
      }
    },
    async publicEvaluation() {
      let success = await this.save();
      if (success) {
        this.showLoading("Publicando");
        let evaluation_id = this.evaluation._id;
        try {
          await publicEvaluation(evaluation_id);
          this.evaluation.public = true;
          this.$forceUpdate();
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
    async remove() {
      this.showLoading("Eliminando");
      let evaluation_id = this.evaluation._id;
      try {
        await deleteEvaluation(evaluation_id);
        this.unselect();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    addQuestion(questions) {
      questions.push({
        question: "Pregunta",
        alternatives: ["Alternativa 1", "Alternativa 2"],
        correct: 0,
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
    },
    // File
    showFiles(question) {
      this.dlg_files = true;
      this.question_selected = question;
    },
    onFileSelected(file) {
      this.dlg_files = false;
      this.evaluation.content[this.question_selected].image = file.url;
    },
  },
  components: {
    Files,
  },
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
  .public {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}

.question {
  width: 100%;
  display: flex;

  &__image {
    position: relative;
    max-width: 80%;
    margin: 0 auto;
    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
    &-close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}

.time-editor {
  width: max-content;
  padding: 8px 10px 20px;

  display: grid;
  grid-template-columns: auto auto;
  row-gap: 4px;
  column-gap: 12px;

  input {
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}
</style>