<template>
  <div v-if="!evaluation" class="m-container">
    <!-- MENU -->
    <div class="evaluations__menu mb-3">
      <strong
        v-show="$store.state.show_limits"
        class="mt-1"
        style="opacity: 0.5"
        >({{
          `${evaluations.length}/${variables.max_evaluations_per_session}`
        }})</strong
      >
      <div></div>
      <m-btn
        @click="create()"
        :disabled="evaluations.length >= variables.max_evaluations_per_session"
        color="primary"
        small
      >
        <v-icon left style="font-size: 0.9rem">mdi-plus</v-icon>Crear Evaluación
      </m-btn>
    </div>
    <!-- EVALUATIONS -->
    <EvaluationCard
      v-for="(evaluation, c_idx) in evaluations"
      :key="c_idx"
      :name="evaluation.name"
      :time_start="evaluation.time_start"
      :time_end="evaluation.time_end"
      :items="[
        {
          label: 'N° Preguntas',
          value: `${evaluation.content.length} preguntas`,
        },
      ]"
      :buttons="[
        {
          text: evaluation.public ? 'Ver Evaluación' : 'Editar',
          icon: evaluation.public ? 'mdi-eye' : 'mdi-pencil',
          color: 'primary',
          action: () => {
            select(evaluation);
          },
        },
        {
          text: 'Resultados',
          icon: 'mdi-poll',
          color: 'primary',
          action: () => {
            results(evaluation);
          },
          disabled: !evaluation.public,
        },
        {
          text: 'Eliminar',
          icon: 'mdi-delete',
          color: 'error',
          action: () => {
            dlg_remove = true;
            evaluation_to_remove = evaluation;
          },
        },
      ]"
      class="mb-3"
    />

    <div class="text-center" v-show="evaluations.length === 0">
      No hay evaluaciones.
    </div>

    <!-- Dialog Remove -->
    <v-dialog v-model="dlg_remove" persistent max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Desea eliminar?</h3>
          <p class="mt-4">Se borrarán también los resultados de los alumnos.</p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
              remove();
            "
            color="error"
            small
            class="ml-2"
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
  <EvaluationEditor
    v-else-if="edit"
    :evaluation="evaluation"
    :unselect="unselect"
    class="m-container pa-4"
  />
  <Results
    v-else
    :evaluation_id="evaluation._id.$oid"
    :unselect="unselect"
    class="pa-4"
  />
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

import variables from "@/models/variables";

export default {
  data: () => ({
    session_id: "",
    evaluation: null,
    evaluation_to_remove: null,
    evaluations: [],
    edit: false,
    dlg_remove: false,
    variables,
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    async getEvaluations() {
      this.showLoading("Cargando Evaluaciones");
      this.evaluations = await getEvaluationsBySession(this.session_id);

      this.evaluations.forEach((e) => {
        if (e.time_start.$date) e.time_start = new Date(e.time_start.$date);
        if (e.time_end.$date) e.time_end = new Date(e.time_end.$date);
      });
      this.hideLoading();
    },
    async create() {
      this.showLoading("Creando Evaluación");

      let now = () => {
        let date = new Date();
        date.setSeconds(0, 0);
        return date;
      };

      let new_evaluation = {
        name: "Nombre",
        time_start: now().addHours(1),
        time_end: now().addHours(2),
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
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async remove() {
      this.showLoading("Eliminando");
      try {
        await deleteEvaluation(this.evaluation_to_remove._id.$oid);
        this.evaluations = this.evaluations.filter(
          (e) => e._id.$oid !== this.evaluation_to_remove._id.$oid
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    select(evaluation) {
      this.edit = true;
      this.evaluation = Object.assign({}, evaluation);
    },
    unselect() {
      this.evaluation = null;
      this.getEvaluations();
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
  justify-content: space-between;
  align-items: center;
}
</style>