<template>
  <div class="editor">
    <div class="editor__menu">
      <v-btn icon @click="unselect()">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <div>
        <m-btn @click="save()" color="primary" small class="mr-2"
          >Guardar</m-btn
        >
        <m-btn color="dark" small>Publicar</m-btn>
      </div>
    </div>

    <div id="editor__body" class="editor__body">
      <div class="evaluation">
        <!-- NAME -->
        <div class="m-card">
          <div class="m-card__body">
            <h3 class="mb-3"><strong>Nombre:</strong></h3>
            <v-text-field
              v-model="evaluation.name"
              autocomplete="off"
              dense
              hide-details
            ></v-text-field>
          </div>
        </div>

        <!-- DATE -->
        <div class="m-card mt-4">
          <div class="m-card__body">
            <h3 class="mb-3"><strong>Fecha:</strong></h3>
            <span>Tiempo de Inicio:</span>
            <date-time v-model="evaluation.time_start" />
            <span>Tiempo de Fin:</span>
            <date-time v-model="evaluation.time_end" />
          </div>
        </div>

        <!-- QUESTION -->
        <div
          v-for="(c, c_idx) in evaluation.content"
          :key="c_idx"
          class="question m-card mt-4"
        >
          <div class="m-card__body">
            <div class="question__text">
              <v-textarea
                v-model="c.question"
                rows="1"
                auto-grow
                dense
                hide-details
                filled
              ></v-textarea>
              <div v-if="c.type === 'closed'" class="ml-2">
                <v-text-field
                  v-model="c.score"
                  label="Puntaje"
                  type="number"
                  autocomplete="off"
                  dense
                  hide-details
                  outlined
                  class="question__score"
                ></v-text-field>
              </div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="
                      question_idx_selected = c_idx;
                      dlg_files = true;
                    "
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-2"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-image</v-icon>
                  </v-btn>
                </template>
                <span>Agregar Imagen</span>
              </v-tooltip>
            </div>
            <div v-if="c.image" class="question__image mt-4">
              <img :src="c.image" />
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="c.image = ''"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-2"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Quitar Imagen</span>
              </v-tooltip>
            </div>

            <div v-if="c.type === 'closed'">
              <v-radio-group v-model="c.correct" hide-details dense>
                <!-- ALTERNATIVE -->
                <div
                  v-for="(alternative, a_idx) in c.alternatives"
                  :key="a_idx"
                  class="alternative mt-4"
                >
                  <v-radio :value="a_idx" class="mr-2"></v-radio>
                  <v-textarea
                    v-model="c.alternatives[a_idx]"
                    rows="1"
                    auto-grow
                    dense
                    hide-details
                  ></v-textarea>
                  <v-tooltip bottom>
                    <template
                      v-if="c.alternatives.length > 2"
                      v-slot:activator="{ on, attrs }"
                    >
                      <v-btn
                        @click="
                          removeQuestionAlternative(c.alternatives, a_idx)
                        "
                        v-bind="attrs"
                        v-on="on"
                        icon
                        class="ml-2"
                      >
                        <v-icon style="font-size: 1.4rem">mdi-close</v-icon>
                      </v-btn>
                    </template>
                    <span>Quitar Alternativa</span>
                  </v-tooltip>
                </div>
              </v-radio-group>
              <!-- ALTERNATIVE ADD -->
              <div
                @click="addQuestionAlternative(c.alternatives)"
                class="alternative-add mt-4"
              >
                <v-icon>mdi-plus</v-icon>
              </div>
            </div>
          </div>
          <div class="question__actions">
            <v-select
              v-model="c.type"
              :items="types"
              item-text="text"
              item-value="value"
              label="Tipo"
              dense
              hide-details
              outlined
              class="mr-1"
            ></v-select>
            <div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="moveUp(evaluation.content, c_idx)"
                    :disabled="c_idx === 0"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-1"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-arrow-up</v-icon>
                  </v-btn>
                </template>
                <span>Mover Arriba</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="moveDown(evaluation.content, c_idx)"
                    :disabled="c_idx === evaluation.content.length - 1"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-1"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-arrow-down</v-icon>
                  </v-btn>
                </template>
                <span>Mover Abajo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="duplicateQuestion(c_idx, c)"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-1"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <span>Duplicar</span>
              </v-tooltip>
              <v-tooltip v-if="evaluation.content.length >= 2" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    @click="removeQuestion(c_idx)"
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-1"
                  >
                    <v-icon style="font-size: 1.4rem">mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </div>
          </div>
        </div>

        <!-- QUESTION ADD -->
        <div @click="addQuestion()" class="question-add my-5">
          <v-icon>mdi-plus</v-icon>
        </div>
      </div>
    </div>

    <!-- DLG FILES -->
    <v-dialog v-model="dlg_files" max-width="1000">
      <Files
        v-if="dlg_files"
        document_type="session"
        :document_id="session_id"
        :filters="['image']"
        @file="onFileSelected"
        class="m-card pa-4"
      />
    </v-dialog>
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";
import DateTime from "@/components/globals/DateTime";

import { updateEvaluationByTeacher } from "@/services/evaluationService";

export default {
  props: ["evaluation", "unselect"],
  data: () => ({
    session_id: "",
    question_idx_selected: -1,
    types: [
      {
        text: "Opción múltiple",
        value: "closed",
      },
      {
        text: "Respuesta",
        value: "open",
      },
    ],
    //
    dlg_files: false,
  }),
  created() {
    this.session_id = this.$route.params["session_id"];
    // this.evaluation.public = true;
  },
  methods: {
    async save() {
      if (!this.evaluation.name) {
        this.showMessage("", "Ingrese un nombre.");
        return;
      }

      this.showLoading("Guardando");
      this.evaluation.id = this.evaluation._id;
      try {
        await updateEvaluationByTeacher(this.evaluation);
      } catch (error) {
        this.showMessage("", error.msg || "Ha ocurrido un error.");
      }
      this.hideLoading();
    },
    addQuestion() {
      let question = {
        question: "Pregunta",
        alternatives: ["Alternativa", "Alternativa"],
        type: "closed",
      };
      this.evaluation.content.push(question);

      let element = document.getElementById("editor__body");
      setTimeout(() => {
        element.scrollTo({
          top: 20000,
          behavior: "smooth",
        });
      }, 100);
    },
    duplicateQuestion(idx, question) {
      let new_question = Object.assign({}, question);
      this.evaluation.content.splice(idx, 0, new_question);
    },
    removeQuestion(idx) {
      if (this.evaluation.content.length <= 1) return;
      this.evaluation.content.splice(idx, 1);
    },
    onFileSelected(file) {
      this.dlg_files = false;
      this.evaluation.content[this.question_idx_selected].image = file.url;
    },
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        arr.splice();
      }
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        arr.splice();
      }
    },
    // QUESTION CLOSED
    addQuestionAlternative(alternatives) {
      alternatives.push("Alternativa");
    },
    removeQuestionAlternative(alternatives, idx) {
      alternatives.splice(idx, 1);
    },
  },
  components: {
    Files,
    DateTime,
  },
};
</script>

<style lang='scss' scoped>
.editor {
  height: 100%;

  display: flex;
  flex-direction: column;

  &__menu {
    padding: 8px 12px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__body {
    overflow: auto;
  }
}

.evaluation {
  margin: 0 auto;
  padding: 10px;
  max-width: 960px;
}

.question {
  &__text {
    display: flex;
    justify-content: center;
  }
  &__score {
    max-width: 100px;
  }
  &__image {
    display: flex;
    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
  }
  &__actions {
    margin: 0 20px;
    padding: 20px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.15);

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.question-add {
  width: 64px;
  height: 64px;
  margin: 0 auto;
  cursor: pointer;

  border-radius: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

  display: flex;
  align-items: center;
  justify-content: center;

  * {
    color: #aaa;
    font-size: 240%;
  }
}

.alternative {
  display: flex;
  justify-content: center;
}
.alternative-add {
  padding: 8px;
  cursor: pointer;

  border: 1px dashed #ccc;
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  * {
    color: #aaa;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
</style>