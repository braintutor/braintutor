<template>
  <div class="quiz-editor-container m-fullscreen">
    <loading :active="loading" :message="loading_msg" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect(); getEvaluations()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          v-if="!evaluation.started"
          class="menu-title"
          v-model="evaluation.name"
          dense
          hide-details
          autocomplete="off"
        ></v-text-field>
        <span v-else class="menu-title">{{evaluation.name}}</span>
      </div>
      <div v-if="!evaluation.started" class="menu-right">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="addQuestion(evaluation.content)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Agregar Pregunta</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="save()">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Guardar Cambios</span>
        </v-tooltip>

        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="dialog_delete = true">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Eliminar Evaluación</span>
        </v-tooltip>
      </div>
    </div>

    <!-- Quiz Content -->
    <div id="quiz-scroll" class="quiz-editor-content m-fullscreen-content">
      <div class="time-editor">
        <span>Tiempo de Inicio:</span>
        <input type="datetime-local" v-model="evaluation.time_start" :disabled="evaluation.started" />
        <span>Tiempo de Fin:</span>
        <input type="datetime-local" v-model="evaluation.time_end" :disabled="evaluation.started" />
      </div>
      <div
        v-for="(c, c_idx) in evaluation.content"
        :key="c_idx"
        class="question-editor-container m-card"
      >
        <div class="question-editor-question question-editor-text">
          <v-textarea
            v-if="!evaluation.started"
            v-model="c.question"
            :rows="1"
            autoGrow
            dense
            hide-details
          ></v-textarea>
          <span v-else>{{c.question}}</span>
          <v-btn
            v-if="!evaluation.started && evaluation.content.length > 1"
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
                  v-if="!evaluation.started"
                  style="width: 0"
                  v-model="c.alternatives[a_idx]"
                  :rows="1"
                  autoGrow
                  dense
                  hide-details
                ></v-textarea>
                <span v-else>{{c.alternatives[a_idx]}}</span>
                <v-btn
                  v-if="!evaluation.started && c.alternatives.length > 2"
                  icon
                  @click="removeAlternative(c.alternatives, a_idx)"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </div>
              <v-radio :disabled="evaluation.started" :value="a_idx"></v-radio>
            </div>
            <div
              v-if="!evaluation.started"
              class="question-editor-alternative-container col-12 col-md-6"
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
        <v-btn
          color="primary"
          v-if="!evaluation.started"
          @click="dialog_public = true"
          small
        >Publicar</v-btn>
      </div>
    </div>

    <!-- Dialog Public -->
    <v-dialog v-model="dialog_public" max-width="300">
      <v-card>
        <v-card-title>Confirmar publicación</v-card-title>
        <v-card-text>Una vez publicada la evaluación, no podrá modificar su contenido.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_public = false">Cancelar</v-btn>
          <v-btn
            small
            depressed
            color="primary"
            @click="dialog_public = false; publicEvaluation()"
          >Publicar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Delete -->
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
  publicEvaluation,
  deleteEvaluation
} from "@/services/evaluationService";

export default {
  props: ["evaluation", "getEvaluations", "unselect"],
  data: () => ({
    loading: false,
    loading_msg: "",
    dialog_delete: false,
    dialog_public: false
  }),
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";
      this.evaluation.id = this.evaluation._id.$oid;
      try {
        await updateEvaluation(this.evaluation);
        this.loading = false;
        return true;
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        this.loading = false;
        return false;
      }
    },
    async publicEvaluation() {
      let success = await this.save();
      if (success) {
        this.loading = true;
        this.loading_msg = "Publicando";
        let evaluation_id = this.evaluation._id.$oid;
        await publicEvaluation(evaluation_id);
        this.evaluation.started = true;
        this.loading = false;
      }
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando";
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
  .public {
    display: flex;
    justify-content: center;
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