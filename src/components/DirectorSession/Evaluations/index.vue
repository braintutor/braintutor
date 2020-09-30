<template>
  <div>
    <EvaluationCard
      v-for="(evaluation, c_idx) in evaluations"
      :key="c_idx"
      :name="evaluation.name"
      :time_start="evaluation.time_start"
      :time_end="evaluation.time_end"
      :size="evaluation.content.length"
      disabled
      class="mb-4"
    >
      <div class="text-center pt-4">
        <m-btn color="primary" small text>Ver Resultados</m-btn>
      </div>
    </EvaluationCard>
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";

export default {
  data: () => ({
    evaluations: [],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Evaluaciones");
    try {
      this.evaluations = this.mongoArr(
        await this.$api.evaluation.getAll(session_id)
      );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    EvaluationCard,
  },
};
</script>