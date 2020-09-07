<template>
  <div class="m-container pa-3">
    <div v-if="!evaluation" class="evaluations">
      <!-- MENU -->
      <div class="evaluations__menu">
        <m-btn
          @click="showAvailable = true"
          :text="!showAvailable"
          color="primary"
          small
          class="mr-2"
        >Nuevos</m-btn>
        <m-btn @click="showAvailable = false" :text="showAvailable" color="dark" small>Otros</m-btn>
      </div>
      <!-- EVALUATIONS -->
      <EvaluationCard
        v-for="evaluation in evaluations_filtered"
        v-model="evaluation.dateState"
        :key="evaluation._id.$oid"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        :hasResult="!!evaluation.result"
        student
        @click="showDialogStart(evaluation)"
        :class="[showAvailable? 'levitation': 'evaluation--disabled']"
        class="evaluation mt-4"
      />

      <p class="text-center my-4" v-show="evaluations_filtered.length === 0">No hay evaluaciones.</p>

      <!-- Dialog Start Evaluation -->
      <v-dialog v-model="dialog_start" persistent max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>Iniciar Evaluación</h3>
            <p
              class="mt-4"
            >Una vez que inicias una evaluación, solo tendrás una oportunidad para responderla.</p>
            <p class="mt-4">No cierres la pestaña o cambies de página.</p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dialog_start = false" color="primary" small text>Cerrar</m-btn>
            <m-btn
              @click="dialog_start = false; select(evaluation_to_start)"
              color="primary"
              small
              class="ml-2"
            >Iniciar</m-btn>
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

import { mapMutations } from "vuex";

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
      return this.evaluations.filter((e) => {
        let is_vailable = !e.result && e.dateState !== -1; // -1:past 0:current 1:future
        return is_vailable === this.showAvailable;
      });
    },
  },
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async getEvaluations() {
      this.loading(true);
      this.loading_msg("Cargando Evaluaciones");
      try {
        this.evaluations = await getEvaluationsBySessionStudent(
          this.session_id
        );
        for (let e of this.evaluations) {
          if (e.time_start.$date) e.time_start = new Date(e.time_start.$date);
          if (e.time_end.$date) e.time_end = new Date(e.time_end.$date);
        }
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    async select(evaluation) {
      this.loading(true);
      this.loading_msg("Cargando Evaluación");
      try {
        evaluation = await getEvaluationByStudent(evaluation._id.$oid);
        this.evaluation = copy(evaluation);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }
      this.loading(false);
    },
    async unselect() {
      this.evaluation = null;
      await this.getEvaluations();
    },
    showDialogStart(evaluation) {
      this.evaluation_to_start = evaluation;
      this.dialog_start = true;
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
    margin: 10px auto;
  }
}
.evaluation {
  &--disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}
</style>