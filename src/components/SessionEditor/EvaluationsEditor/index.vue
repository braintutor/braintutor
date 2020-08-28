<template>
  <div class="m-container pa-4">
    <div v-if="!evaluation">
      <!-- MENU -->
      <div class="evaluations__menu">
        <m-btn @click="create()" color="primary" small>
          <v-icon left style="font-size: .9rem">mdi-plus</v-icon>Crear Evaluación
        </m-btn>
      </div>
      <!-- EVALUATIONS -->
      <EvaluationCard
        v-for="(evaluation, c_idx) in evaluations"
        :key="c_idx"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        :size="evaluation.content.length"
        :buttons="[{
            text: evaluation.started? 'Ver Evaluación': 'Editar',
            icon: evaluation.started? 'mdi-eye': 'mdi-pencil',
            color: 'primary',
            action: () => {select(evaluation)}
          },{
            text: 'Resultados',
            icon: 'mdi-poll',
            color: 'primary',
            action: () => {results(evaluation)},
            disabled: !evaluation.started
          },{
            text: 'Eliminar',
            icon: 'mdi-delete',
            color: 'error',
            action: () => {dlg_remove = true; evaluation_to_remove = evaluation}
          }]"
        disabled
        class="mt-4"
      />

      <div class="text-center mt-4" v-show="evaluations.length === 0">No hay evaluaciones.</div>

      <!-- Dialog Remove -->
      <v-dialog v-model="dlg_remove" persistent max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h4>¿Desea eliminar?</h4>
            <p class="mt-4">Se borrarán también los resultados de los alumnos.</p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_remove = false" color="primary" small>Cancelar</m-btn>
            <m-btn @click=" dlg_remove = false; remove()" color="error" small class="ml-2">Eliminar</m-btn>
          </div>
        </div>
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
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";
import EvaluationEditor from "./EvaluationEditor";
import Results from "./Results";

import {
  getEvaluationsBySession,
  addEvaluation,
  deleteEvaluation,
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    session_id: "",
    evaluation: null,
    evaluation_to_remove: null,
    evaluations: [],
    edit: false,
    dlg_remove: false,
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async getEvaluations() {
      this.loading(true);
      this.loading_msg("Cargando Evaluaciones");
      this.evaluations = await getEvaluationsBySession(this.session_id);

      this.evaluations.forEach((e) => {
        if (typeof e.time_start === "object")
          e.time_start = new Date(e.time_start.$date)
            .toISOString()
            .substring(0, 16);
        if (typeof e.time_end === "object")
          e.time_end = new Date(e.time_end.$date)
            .toISOString()
            .substring(0, 16);
      });
      this.loading(false);
    },
    async create() {
      this.loading(true);
      this.loading_msg("Creando Evaluación");

      let now = () => {
        let date = new Date();
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date;
      };
      let format = (date) => date.toISOString().slice(0, 16);

      let new_evaluation = {
        name: "Nombre",
        time_start: format(now().addHours(1)),
        time_end: format(now().addHours(2)),
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa 1", "Alternativa 2"],
            correct: 0,
          },
        ],
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
      this.loading(false);
    },
    async remove() {
      this.loading(true);
      this.loading_msg("Eliminando");

      try {
        await deleteEvaluation(this.evaluation_to_remove._id.$oid);
        this.evaluations = this.evaluations.filter(
          (e) => e._id.$oid !== this.evaluation_to_remove._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading(false);
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
    },
  },
  components: {
    EvaluationCard,
    EvaluationEditor,
    Results,
  },
};
</script>

<style lang='scss' scoped>
.evaluations__menu {
  display: flex;
  justify-content: flex-end;
}
</style>