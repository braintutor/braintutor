<template>
  <div>
    <div v-show="!evaluation_selected">
      <EvaluationCard
        v-for="(evaluation, c_idx) in evaluations_filtered"
        :key="c_idx"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        class="mb-4"
      >
        <div class="text-center pt-4">
          <m-btn
            @click="evaluation_selected = evaluation"
            color="primary"
            small
            text
            >Ver Resultados</m-btn
          >
        </div>
      </EvaluationCard>
      <div v-show="evaluations_filtered.length <= 0" class="text-center">
        No hay Evaluaciones
      </div>
    </div>
    <div v-if="evaluation_selected">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="evaluation_selected = null">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">{{ evaluation_selected.name }}</span>
        </div>
      </div>
      <EvaluationResults :evaluation="evaluation_selected" :role="'DIR'" />
    </div>
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";
import EvaluationResults from "@/components/TeacherSession/EvaluationsEditor/EvaluationResults";

export default {
  props: {
    type: String
  },
  data: () => ({
    evaluations: [],
    evaluation_selected: null,
  }),
  computed: {
    evaluations_filtered() {
      let evaluations = this.evaluations.map((e) => ({
        ...e,
        _id: e.id,
        time_start: new Date(e.time_start + "Z"),
        time_end: new Date(e.time_end + "Z"),
      }));
      evaluations.sort(
        (a, b) => new Date(b.time_start) - new Date(a.time_start)
      );
      return evaluations;
    },
  },
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Evaluaciones");
    try {
      this.evaluations = await this.$api.evaluation.getAll(session_id, this.type);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    EvaluationCard,
    EvaluationResults,
  },
};
</script>