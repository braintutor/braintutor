<template>
  <div class="m-container pa-3">
    <div v-if="!evaluation">
      <loading :active="loading" :message="loading_message" />
      <div class="row no-gutters">
        <div
          class="col-12 col-sm-6 col-md-4 px-2 pb-4"
          v-for="(evaluation, c_idx) in evaluations"
          :key="c_idx"
        >
          <!--  -->
          <div class="m-cardd">
            <p class="m-cardd__name">{{evaluation.name}}</p>
            <div class="m-cardd__body">
              <span v-if="evaluation.time_start" class="m-cardd__item">Inicio:</span>
              <span
                v-if="evaluation.time_start"
                class="m-cardd__value"
              >{{dateFormat(evaluation.time_start)}}</span>
              <span v-if="evaluation.time_end" class="m-cardd__item">Fin:</span>
              <span
                v-if="evaluation.time_end"
                class="m-cardd__value"
              >{{dateFormat(evaluation.time_end)}}</span>
              <span class="m-cardd__item">N° preg.</span>
              <span class="m-cardd__value">{{evaluation.content.length}} pregunta(s)</span>
            </div>
            <!--  -->
            <div class="m-cardd__actions">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="m-cardd__action"
                    v-bind="attrs"
                    v-on="on"
                    @click="select(evaluation)"
                  >{{evaluation.started? 'mdi-eye': 'mdi-pencil'}}</v-icon>
                </template>
                <span style="font-size: .75rem">{{evaluation.started? 'Ver Evaluación': 'Editar'}}</span>
              </v-tooltip>

              <v-tooltip v-if="evaluation.started" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="m-cardd__action"
                    v-bind="attrs"
                    v-on="on"
                    @click="results(evaluation)"
                  >mdi-poll</v-icon>
                </template>
                <span style="font-size: .75rem">Resultados</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    class="m-cardd__action"
                    v-bind="attrs"
                    v-on="on"
                    @click="dlg_remove = true; evaluation_to_remove = evaluation"
                  >mdi-delete</v-icon>
                </template>
                <span style="font-size: .75rem">Eliminar</span>
              </v-tooltip>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-md-4 px-2 pb-4">
          <div class="create" @click="create()">+</div>
        </div>
      </div>

      <!-- Dialog Remove -->
      <v-dialog v-model="dlg_remove" persistent max-width="300">
        <v-card>
          <div class="pt-4 pb-3 text-center">¿Desea eliminar?</div>
          <v-card-text class="text-center pb-2">Se borrarán también los resultados de los alumnos.</v-card-text>
          <v-card-actions style="width: max-content; margin: 0 auto">
            <v-btn @click="dlg_remove = false" small text>Cancelar</v-btn>
            <v-btn @click=" dlg_remove = false; remove()" color="error" small depressed>Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <EvaluationEditor
      v-else-if="edit"
      :evaluation="evaluation"
      :getEvaluations="getEvaluations"
      :unselect="unselect"
    />
    <Results
      v-else
      :evaluation_id="evaluation._id.$oid"
      :getEvaluations="getEvaluations"
      :unselect="unselect"
    />
  </div>
</template>

<script>
import loading from "@/components/loading";
import EvaluationEditor from "./EvaluationEditor";
import Results from "./Results";

import {
  getEvaluationsBySession,
  addEvaluation,
  deleteEvaluation
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
import { dateFormat } from "@/services/date.js";

export default {
  data: () => ({
    session_id: "",
    evaluation: null,
    evaluation_to_remove: null,
    evaluations: [],
    edit: false,
    dlg_remove: false,
    //
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    dateFormat,
    async getEvaluations() {
      this.loading = true;
      this.loading_message = "Cargando Evaluaciones";
      this.evaluations = await getEvaluationsBySession(this.session_id);
      this.loading = false;
    },
    async create() {
      this.loading = true;
      this.loading_message = "Creando Evaluación";

      let now = () => {
        let date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date;
      };
      let format = date => date.toISOString().slice(0, 16);

      let new_evaluation = {
        name: "Nombre",
        time_start: format(now().addHours(1)),
        time_end: format(now().addHours(2)),
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa 1", "Alternativa 2"],
            correct: 0
          }
        ]
      };
      try {
        let evaluation_id = await addEvaluation(
          this.session_id,
          new_evaluation
        );
        new_evaluation._id = evaluation_id;
        this.evaluations.push(new_evaluation);
        this.select(new_evaluation);
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Guardar", error.msg);
      }
      this.loading = false;
    },
    async remove() {
      this.loading = true;
      this.loading_message = "Eliminando";

      try {
        await deleteEvaluation(this.evaluation_to_remove._id.$oid);
        this.evaluations = this.evaluations.filter(
          e => e._id.$oid !== this.evaluation_to_remove._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    },
    select(evaluation) {
      this.edit = true;
      this.evaluation = copy(evaluation);
    },
    unselect() {
      this.evaluation = null;
    },
    results(evaluation) {
      this.edit = false;
      this.evaluation = copy(evaluation);
    }
  },
  components: {
    loading,
    EvaluationEditor,
    Results
  }
};
</script>

<style lang='scss' scoped>
.evaluation {
  padding: 10px 12px 4px 12px;
  border-top: 4px solid #e5c280;
  border-radius: 7px;
  cursor: pointer;
  &__name {
    margin: 3px 0 9px 0;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
  &__detail {
    padding: 4px 10px;
    margin-bottom: 10px;
    background: #f1f1f1;
    text-align: center;
    font-size: 0.9rem;
    font-weight: lighter;
    border-radius: 10px;
  }
}
.create {
  min-height: 150px;
  height: 100%;
  color: #acacac;
  font-size: 2.5rem;
  font-weight: lighter;
  border: 2px dashed #ccc;
  border-radius: 10px;
  transition: background-color 0.3s;
  cursor: pointer;
  //
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background: #f7f7f7;
  }
}
</style>