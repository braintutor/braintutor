<template>
  <div>
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
                  evaluation.content.length >=
                  EvaluationModel.content.max_length
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
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="dialog_delete = true"
              >
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
          <span class="span-time">Tiempo de Inicio:</span>
          <date-time
            v-model="evaluation.time_start_f"
            :disabled="evaluation.public"
          />
          <span class="span-time">Tiempo de Fin:</span>
          <date-time
            v-model="evaluation.time_end_f"
            :disabled="evaluation.public"
          />
        </div>

        <div class="m-card mb-5">
          <div class="score m-card__body">
            <p class="score__title">Convertir Puntaje a Nota</p>
            <div
              v-for="(item, idx) in map_score_to_note"
              :key="idx"
              class="score__rule mb-3"
            >
              <div>
                <span>Si es</span>
                <span v-if="idx > 0">
                  {{
                    `${
                      map_score_to_note[idx - 1].is_equal
                        ? "mayor a"
                        : "mayor o igual a"
                    } ${map_score_to_note[idx - 1].max || "?"}`
                  }}
                </span>
                <span v-if="idx > 0 && idx < map_score_to_note.length - 1"
                  >y</span
                >
                <span v-if="idx < map_score_to_note.length - 1">
                  <select v-model="item.is_equal" :disabled="evaluation.public">
                    <option :value="false">menor a</option>
                    <option :value="true">menor o igual a</option>
                  </select>
                  <input
                    type="number"
                    v-model="item.max"
                    :disabled="evaluation.public"
                  />
                  <!-- :min="idx > 0 ? map_score_to_note[idx - 1].max : 0" -->
                </span>
                <span>tiene</span>
                <input
                  type="text"
                  v-model="item.note"
                  :disabled="evaluation.public"
                />
              </div>
              <v-tooltip v-if="!evaluation.public" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    v-if="map_score_to_note.length > 2"
                    @click="map_score_to_note.splice(idx, 1)"
                    icon
                    small
                  >
                    <v-icon style="font-size: 1.4rem">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span style="font-size: 0.75rem">Quitar</span>
              </v-tooltip>
            </div>
            <div
              v-if="!evaluation.public"
              @click="
                map_score_to_note.push({});
                $forceUpdate();
              "
              class="score__add"
            >
              +
            </div>
          </div>
        </div>

        <div
          v-for="(c, c_idx) in evaluation.content"
          :key="c_idx"
          class="question-editor-container m-card"
        >
          <div
            class="pa-2"
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
            "
          >
            <strong>Puntaje:</strong>
            <input
              v-if="!evaluation.public"
              type="number"
              v-model="c.score"
              :min="0"
              class="ml-2 py-1 px-3"
              style="
                border: 1px solid #ccc;
                border-radius: 6px;
                max-width: 90px;
              "
            />
            <span
              v-else
              class="ml-2 py-1 px-3"
              style="
                border: 1px solid #ccc;
                border-radius: 6px;
                max-width: 90px;
              "
              >{{ c.score }}</span
            >
          </div>
          <div class="question-editor-question question-editor-text">
            <div v-if="!evaluation.public" class="question">
              <v-textarea
                v-model="c.question"
                :rows="1"
                autoGrow
                dense
              ></v-textarea>
              <v-btn @click="showFiles(c_idx)" icon>
                <v-icon>mdi-image</v-icon>
              </v-btn>
            </div>
            <span v-else>{{ c.question }}</span>

            <v-tooltip
              bottom
              v-if="!evaluation.public && evaluation.content.length > 1"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="removeQuestion(evaluation.content, c_idx)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
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
                <v-radio :disabled="evaluation.public" :value="a_idx"></v-radio>
                <div
                  class="question-editor-alternative-content question-editor-text"
                >
                  <v-textarea
                    v-if="!evaluation.public"
                    style="width: 0"
                    v-model="c.alternatives[a_idx]"
                    :rows="1"
                    autoGrow
                    dense
                  ></v-textarea>
                  <span v-else>{{ c.alternatives[a_idx] }}</span>
                  <v-tooltip
                    bottom
                    v-if="!evaluation.public && c.alternatives.length > 2"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        @click="removeAlternative(c.alternatives, a_idx)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </div>
              </div>
              <div
                v-if="!evaluation.public"
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
    </div>

    <!-- Dialog Public -->
    <v-dialog v-model="dialog_public" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Confirmar publicación</h3>
            <v-btn class="mx-2" icon small @click="dialog_public = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Una vez publicada la evaluación, no podrá modificar su contenido.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_public = false" small text class="cancel-button"
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
          <div class="close-modal">
            <h3>Confirmar eliminación</h3>
            <v-btn class="mx-2" icon small @click="dialog_delete = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_delete = false" small class="cancel-button"
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
import DateTime from "@/components/globals/DateTime";

export default {
  props: ["evaluation", "unselect"],
  data: () => ({
    session_id: "",
    question_selected: -1,
    map_score_to_note: [],
    dialog_delete: false,
    dialog_public: false,
    dlg_files: false,
    EvaluationModel,
  }),
  created() {
    this.session_id = this.$route.params["session_id"];
    let { time_start, time_end } = this.evaluation;
    this.evaluation.time_start_f = time_start;
    this.evaluation.time_end_f = time_end;

    this.map_score_to_note = [{}, {}];
    if (
      this.evaluation.map_score_to_note &&
      this.evaluation.map_score_to_note.length >= 2
    )
      this.map_score_to_note = this.evaluation.map_score_to_note;

    this.$forceUpdate();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      this.evaluation.id = this.evaluation._id;
      this.evaluation.time_start = new Date(this.evaluation.time_start_f);
      this.evaluation.time_end = new Date(this.evaluation.time_end_f);
      this.evaluation.map_score_to_note = this.map_score_to_note;
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
    DateTime,
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

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}

.span-time {
  display: flex;
  align-items: center;
}

.time-editor {
  width: max-content;
  padding: 8px 10px 16px;
  display: grid;
  grid-template-columns: auto auto;
  row-gap: 4px;
  column-gap: 12px;

  input {
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}

.score {
  &__title {
    font-weight: bold;
    font-size: 1rem;
  }

  &__rule {
    font-size: 0.9rem;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__add {
    text-align: center;
    font-size: 1.5rem;
    color: rgb(151, 151, 151);
    border: 1.5px dashed #ccc;
    border-radius: 8px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background: rgb(241, 241, 241);
    }
  }

  select,
  input {
    padding: 6px 12px;
    margin: 0 8px;
    box-shadow: 0 2px 10px #ccc;
    border-radius: 6px;
  }
  input[type="number"] {
    max-width: 90px;
  }
  input[type="text"] {
    max-width: 120px;
  }
}
</style>