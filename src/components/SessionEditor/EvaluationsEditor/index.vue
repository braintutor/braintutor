<template>
  <div v-if="!evaluation">
    <loading :active="loading" :message="loading_message" />
    <div class="row no-gutters">
      <div
        class="col-6 col-sm-4 col-md-3 px-2 pb-4"
        v-for="(evaluation, c_idx) in evaluations"
        :key="c_idx"
      >
        <Card>
          <p class="card-item">{{evaluation.name}}</p>
          <p class="card-value">{{evaluation.content.length}} pregunta(s)</p>
          <p class="card-value">{{evaluation.time}} minutos</p>
          <p class="card-actions">
            <v-icon
              @click="select(evaluation)"
              class="card-action"
              style="color: #fff; font-size: 1.2rem"
            >{{evaluation.started? 'mdi-eye': 'mdi-pencil'}}</v-icon>
            <v-icon
              v-if="evaluation.started"
              @click="results(evaluation)"
              class="card-action"
              style="color: #fff; font-size: 1.2rem"
            >mdi-poll</v-icon>
          </p>
        </Card>
      </div>
      <div class="col-6 col-sm-4 col-md-3 px-2 pb-4">
        <div class="create" @click="create()">+</div>
      </div>
    </div>
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
</template>

<script>
import loading from "@/components/loading";
import Card from "@/components/Card";
import EvaluationEditor from "./EvaluationEditor";
import Results from "./Results";

import {
  getEvaluationsBySession,
  addEvaluation
} from "@/services/evaluationService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";

export default {
  data: () => ({
    session_id: "",
    evaluation: null,
    evaluations: [],
    edit: false,
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  methods: {
    async getEvaluations() {
      this.loading = true;
      this.loading_message = "Cargando Evaluaciones";
      this.evaluations = await getEvaluationsBySession(this.session_id);
      this.loading = false;
    },
    async create() {
      this.loading = true;
      this.loading_message = "Creando Evaluación";
      let new_evaluation = {
        name: "Nombre",
        time: 60,
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa 1", "Alternativa 2"],
            correct: 0
          }
        ]
      };
      let evaluation_id = await addEvaluation(this.session_id, new_evaluation);
      new_evaluation._id = evaluation_id;
      this.evaluations.push(new_evaluation);
      this.select(new_evaluation);
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
    Card,
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
  min-height: 110px;
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