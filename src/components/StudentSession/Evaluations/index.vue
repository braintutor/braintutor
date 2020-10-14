<template>
  <div class="m-container">
    <div v-if="!evaluation" class="evaluations">
      <!-- MENU -->
      <div class="evaluations__menu mb-3">
        <m-btn
          @click="showAvailable = true"
          :text="!showAvailable"
          color="primary"
          small
          class="mr-2"
          >Por Realizar</m-btn
        >
        <m-btn
          @click="showAvailable = false"
          :text="showAvailable"
          color="dark"
          small
          >Otros</m-btn
        >
      </div>
      <!-- EVALUATIONS -->
      <EvaluationCard
        v-for="(evaluation, c_idx) in evaluations_filtered"
        v-model="evaluation.dateState"
        :key="c_idx"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        :items="[
          {
            label: 'Estado',
            value: !!evaluation.result ? 'Completado' : 'Sin Realizar',
          },
        ]"
        @click="showDialogStart(evaluation)"
        :class="[showAvailable ? 'levitation' : 'evaluation--disabled']"
        class="evaluation mb-3"
      />

      <p class="text-center" v-show="evaluations_filtered.length === 0">
        No hay evaluaciones.
      </p>

      <!-- Dialog Start Evaluation -->
      <v-dialog v-model="dialog_start" persistent max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>Iniciar Evaluación</h3>
            <p class="mt-4">
              Una vez que inicias una evaluación, solo tendrás una oportunidad
              para responderla.
            </p>
            <p class="mt-4">No cierres la pestaña o cambies de página.</p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dialog_start = false" color="primary" small text
              >Cerrar</m-btn
            >
            <m-btn
              @click="
                dialog_start = false;
                select(evaluation_to_start);
              "
              color="primary"
              small
              class="ml-2"
              >Iniciar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>

    <Evaluation v-else :evaluation="evaluation" :unselect="unselect" />
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";
import Evaluation from "./Evaluation";

import {
  getEvaluationsBySessionStudent,
  getEvaluationByStudent,
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";

export default {
  data: () => ({
    session_id: "",
    evaluation_to_start: null,
    evaluation: null,
    evaluations: [],
    //
    showAvailable: true,
    dialog_start: false,
  }),
  computed: {
    evaluations_filtered() {
      let evaluations = this.evaluations.filter(
        (evaluation) => this.showAvailable === this.isAvailable(evaluation)
      );
      return this.orderObjectsByDate(evaluations, "time_start");
    },
  },
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    async getEvaluations() {
      this.showLoading("Cargando Evaluaciones");
      try {
        this.evaluations = this.mongoArr(
          await getEvaluationsBySessionStudent(this.session_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async select(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        evaluation = await getEvaluationByStudent(evaluation._id);
        this.evaluation = copy(evaluation);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async unselect() {
      this.evaluation = null;
      await this.getEvaluations();
    },
    showDialogStart(evaluation) {
      this.evaluation_to_start = evaluation;
      this.dialog_start = true;
    },
    isAvailable(evaluation) {
      return !evaluation.result && evaluation.dateState !== -1; // -1:past 0:current 1:future
    },
  },
  components: {
    EvaluationCard,
    Evaluation,
  },
};
</script>

<style lang='scss' scoped>
.evaluations {
  &__menu {
    width: max-content;
    margin: 0 auto;
  }
}
.evaluation {
  &--disabled {
    pointer-events: none;
    opacity: 0.75;
  }
}
</style>