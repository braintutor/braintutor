<template>
  <div class="m-container pa-3">
    <div v-if="!evaluation">
      <!-- EVALUATIONS -->
      <EvaluationCard
        v-for="(evaluation, c_idx) in evaluations"
        :key="c_idx"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        :disabled="!!evaluation.result"
        :state="!!evaluation.result"
        student
        @click="showDialogStart(evaluation)"
        class="mt-4"
      />

      <p class="text-center mt-2" v-show="evaluations.length === 0">No hay evaluaciones.</p>

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
    user_role: -1,
    dialog_start: false,
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.user_role = this.$store.state.user.role;
    this.getEvaluations();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async getEvaluations() {
      this.loading(true);
      this.loading_msg("Cargando Evaluaciones");
      this.evaluations = await getEvaluationsBySessionStudent(this.session_id);

      for (let e of this.evaluations) {
        if (e.time_start.$date) e.time_start = new Date(e.time_start.$date);
        if (e.time_end.$date) e.time_end = new Date(e.time_end.$date);
      }
      this.loading(false);
    },
    async select(evaluation) {
      if (this.user_role === "STU") {
        this.loading(true);
        this.loading_msg("Cargando Evaluación");
        try {
          evaluation = await getEvaluationByStudent(evaluation._id.$oid);
          this.evaluation = copy(evaluation);
        } catch (error) {
          this.$root.$children[0].showMessage("", error.msg);
        }
        this.loading(false);
      }
    },
    async unselect() {
      this.evaluation = null;
      await this.getEvaluations();
    },
    showDialogStart(evaluation) {
      if (!evaluation.result && this.user_role === "STU") {
        this.evaluation_to_start = evaluation;
        this.dialog_start = true;
      }
    },
  },
  components: {
    EvaluationCard,
    Evaluation,
  },
};
</script>

<style lang='scss' scoped>
$color-evaluation: #e5c280;

.result {
  padding: 40px;
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  &__diagram {
    margin-bottom: 30px;
    font-size: 2rem;
  }
  &__message {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 16px;
  }
}
</style>