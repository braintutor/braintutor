<template>
  <!-- Evaluation List -->
  <v-container v-if="!evaluation_selected" fluid class="pa-3">
    <v-row no-gutters>
      <v-col
        cols="6"
        md="3"
        lg="2"
        class="pa-2"
        v-for="(evaluation, e_idx) in evaluations"
        :key="e_idx"
      >
        <Cartel
          :description="evaluation.nombre"
          :image="'https://i.pinimg.com/originals/ff/92/68/ff92685e660a2d347736f44cc7a11d38.jpg'"
          :callback="() => selectEvaluation(evaluation)"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- Evaluation Selected -->
  <Evaluation
    v-else
    :evaluation="evaluation_selected"
    :unselectEvaluation="unselectEvaluation"
  />
</template>

<script>
import Cartel from "@/components/Cartel";
import Evaluation from "./Evaluation";

import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";
import { getQuizzes } from "@/services/quizService";

export default {
  props: ["showServices"],
  data: () => ({
    evaluations: [],
    evaluation_selected: null
  }),
  mounted() {
    let chatbot_id = getParam("chatbot_id");
    getQuizzes(chatbot_id).then(res => {
      this.evaluations = res;
    });
  },
  methods: {
    selectEvaluation(evaluation) {
      this.evaluation_selected = copy(evaluation);
      this.showServices(false);
    },
    unselectEvaluation() {
      this.evaluation_selected = null;
      this.showServices(true);
    }
  },
  components: {
    Cartel,
    Evaluation
  }
};
</script>

<style lang='scss' scoped>
</style>