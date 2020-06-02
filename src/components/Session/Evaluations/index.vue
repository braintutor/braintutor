<template>
  <div v-if="!evaluation">
    <loading :active="loading" :message="loading_message" />
    <div class="row no-gutters">
      <div
        class="col-6 col-sm-4 col-md-3 px-2 pb-4"
        v-for="(evaluation, c_idx) in evaluations"
        :key="c_idx"
      >
        <div class="evaluation m-card transform-scale" @click="showDialogStart(evaluation)">
          <p class="evaluation__name">{{evaluation.name}}</p>
          <p class="evaluation__detail">{{evaluation.content.length}} pregunta(s)</p>
          <p class="evaluation__detail">{{evaluation.time}} minutos</p>
          <p
            class="evaluation__result"
            v-if="evaluation.result && evaluation.result.started"
          >Puntaje: {{calculate(evaluation.result) || '00'}}</p>
        </div>
      </div>
    </div>
    <!-- Dialog Start Evaluation -->
    <v-dialog v-model="dialog_start" max-width="400">
      <v-card>
        <v-card-title>Iniciar Evaluación</v-card-title>
        <v-card-text class="pb-2">Una vez que inicias una evaluación, solo tendrás una oportunidad para responderla.</v-card-text>
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
    <v-dialog v-model="dialog_result" max-width="400">
      <v-card class="result">
        <v-progress-circular
          class="result__diagram"
          :rotate="270"
          :size="180"
          :width="8"
          :value="score"
          color="primary"
        >{{`${result.corrects}/${result.total}`}}</v-progress-circular>
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
</template>

<script>
import loading from "@/components/loading";
import Evaluation from "./Evaluation";

import {
  getEvaluationsBySessionStudent,
  startEvaluation,
  getResultByStudent
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
import { percentage } from "@/services/math";
import { getSession } from "@/services/security";

export default {
  data: () => ({
    session_id: "",
    evaluation_to_start: null,
    evaluation: null,
    evaluations: [],
    //
    session_type: -1,
    score: 0,
    result_messages: [],
    result: {},
    //
    loading: true,
    loading_message: "",
    dialog_start: false,
    dialog_result: false
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.session_type = getSession().type;
    this.getEvaluations();
  },
  methods: {
    async getEvaluations() {
      this.loading = true;
      this.loading_message = "Cargando Evaluaciones";
      this.evaluations = await getEvaluationsBySessionStudent(this.session_id);
      this.loading_message = "Cargando Puntajes";
      for (let evaluation of this.evaluations) {
        evaluation.result = await getResultByStudent(evaluation._id.$oid);
      }
      this.loading = false;
    },
    async select(evaluation) {
      // if the evaluation has not started previously
      if (
        !(evaluation.result && evaluation.result.started) &&
        this.session_type == 2
      ) {
        this.loading = true;
        this.loading_message = "Iniciando Evaluación";
        await startEvaluation(evaluation._id.$oid);
        this.evaluation = copy(evaluation);
        this.loading = false;
      }
    },
    unselect() {
      this.evaluation = null;
    },
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      score = ("0" + score).slice(-2);
      return score;
    },
    showResult(result) {
      this.dialog_result = true;
      this.result = result;
      setTimeout(() => {
        this.score = percentage(this.result.total, this.result.corrects);
      }, 500);
      this.result_messages = [
        `Respondiste correctamente ${this.result.corrects} de ${this.result.total} preguntas.`,
        `Obtuviste un puntaje de ${this.calculate(this.result)}.`
      ];
    },
    showDialogStart(evaluation) {
      if (
        !(evaluation.result && evaluation.result.started) &&
        this.session_type == 2
      ) {
        this.evaluation_to_start = evaluation;
        this.dialog_start = true;
      }
    }
  },
  components: {
    loading,
    Evaluation
  }
};
</script>

<style lang='scss' scoped>
$color-evaluation: #e5c280;

.evaluation {
  padding: 10px 12px 4px 12px;
  border-top: 4px solid $color-evaluation;
  border-radius: 7px;
  text-align: center;
  cursor: pointer;
  &__name {
    margin: 3px 0 9px 0;
    text-align: center;
    font-size: 1rem;
    font-weight: bold;
  }
  &__result {
    padding: 4px 10px;
    margin-bottom: 10px;
    background: $color-evaluation;
    color: #fff;
    font-weight: bold;
    border-radius: 10px;
  }
  &__detail {
    padding: 4px 10px;
    margin-bottom: 10px;
    background: #f1f1f1;
    font-size: 0.9rem;
    font-weight: lighter;
    border-radius: 10px;
  }
}

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