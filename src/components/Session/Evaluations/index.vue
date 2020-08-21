<template>
  <div class="m-container pa-3">
    <div v-if="!evaluation">
      <loading :active="loading" :message="loading_msg" />
      <div class="row no-gutters">
        <div
          class="col-12 col-sm-6 col-md-4 px-2 pb-4"
          v-for="(evaluation, c_idx) in evaluations"
          :key="c_idx"
        >
          <div
            class="m-cardd transform-scale"
            style="cursor: pointer"
            @click="showDialogStart(evaluation)"
          >
            <p class="m-cardd__name">{{evaluation.name}}</p>
            <div class="m-cardd__body">
              <span class="m-cardd__item">Inicio:</span>
              <span class="m-cardd__value">{{dateFormat(evaluation.time_start)}}</span>
              <span class="m-cardd__item">Fin:</span>
              <span class="m-cardd__value">{{dateFormat(evaluation.time_end)}}</span>
              <span
                class="m-cardd__item"
                v-if="evaluation.result && evaluation.result.score != null"
              >Puntaje:</span>
              <span
                class="m-cardd__result"
                v-if="evaluation.result && evaluation.result.score != null"
              >{{format(evaluation.result.score)}}</span>
            </div>
          </div>
        </div>
      </div>
      <p class="text-center mt-2" v-show="evaluations.length === 0">No hay evaluaciones.</p>
      <!-- Dialog Start Evaluation -->
      <v-dialog v-model="dialog_start" max-width="400">
        <v-card>
          <v-card-title>Iniciar Evaluación</v-card-title>
          <v-card-text
            class="pb-2"
          >Una vez que inicias una evaluación, solo tendrás una oportunidad para responderla.</v-card-text>
          <v-card-text>No cierres la pestaña o cambies de página.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn small text @click="dialog_start = false">Cerrar</v-btn>
            <v-btn
              small
              color="primary"
              @click="dialog_start = false; select(evaluation_to_start)"
            >Iniciar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Dialog Result -->
      <v-dialog v-model="dialog_score" max-width="400">
        <v-card class="result">
          <v-progress-circular
            class="result__diagram"
            :rotate="270"
            :size="120"
            :width="8"
            :value="score"
            color="primary"
          >{{score_f}}</v-progress-circular>
          <span
            v-for="(message, m_idx) in result_messages"
            :key="m_idx"
            class="result__message"
          >{{message}}</span>
        </v-card>
      </v-dialog>
    </div>
    <Evaluation
      v-else
      :evaluation="evaluation"
      :getEvaluations="getEvaluations"
      :unselect="unselect"
      :showResult="showResult"
    />
  </div>
</template>

<script>
import loading from "@/components/loading";
import Evaluation from "./Evaluation";

import {
  getEvaluationsBySessionStudent,
  getEvaluationByStudent,
  getResultByStudent,
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
import { dateFormat, format_two_digits } from "@/services/date.js";

export default {
  data: () => ({
    session_id: "",
    evaluation_to_start: null,
    evaluation: null,
    evaluations: [],
    //
    user_role: -1,
    score: 0,
    score_f: 0,
    result_messages: [],
    //
    loading: true,
    loading_msg: "",
    dialog_start: false,
    dialog_score: false,
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.user_role = this.$store.state.user.role;
    this.getEvaluations();
  },
  methods: {
    dateFormat,
    async getEvaluations() {
      this.loading = true;
      this.loading_msg = "Cargando Evaluaciones";
      this.evaluations = await getEvaluationsBySessionStudent(this.session_id);
      this.loading_msg = "Cargando Puntajes";
      for (let e of this.evaluations) {
        if (typeof e.time_start === "object")
          e.time_start = new Date(e.time_start.$date)
            .toISOString()
            .substring(0, 16);
        if (typeof e.time_end === "object")
          e.time_end = new Date(e.time_end.$date)
            .toISOString()
            .substring(0, 16);
        e.result = await getResultByStudent(e._id.$oid);
      }
      this.loading = false;
    },
    async select(evaluation) {
      if (this.user_role === "STU") {
        this.loading = true;
        this.loading_msg = "Cargando Evaluación";
        try {
          evaluation = await getEvaluationByStudent(evaluation._id.$oid);
          this.evaluation = copy(evaluation);
        } catch (error) {
          this.$root.$children[0].showMessage("", error.msg);
        }
        this.loading = false;
      }
    },
    unselect() {
      this.evaluation = null;
    },
    format(result) {
      let score = Math.round(result * 20);
      score = format_two_digits(score);
      return score;
    },
    showResult(score) {
      this.dialog_score = true;
      this.score = 0;
      setTimeout(() => {
        this.score = score * 100;
      }, 500);
      this.score_f = this.format(score);
      this.result_messages = [`Obtuviste un puntaje de ${this.score_f}.`];
    },
    showDialogStart(evaluation) {
      if ((evaluation.result || {}).score == null && this.user_role === "STU") {
        this.evaluation_to_start = evaluation;
        this.dialog_start = true;
      }
    },
  },
  components: {
    loading,
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