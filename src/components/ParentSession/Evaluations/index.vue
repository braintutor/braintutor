<template>
  <div class="m-container">
    <EvaluationCard
      v-for="(evaluation, c_idx) in evaluations_ordered"
      :key="c_idx"
      :name="evaluation.name"
      :time_start="evaluation.time_start"
      :time_end="evaluation.time_end"
      class="mb-4"
    />

    <div v-show="evaluations_ordered.length <= 0" class="text-center">
      No hay Evaluaciones
    </div>
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";

export default {
  data: () => ({
    evaluations: [],
  }),
  computed: {
    evaluations_ordered() {
      return this.orderObjectsByDate(this.evaluations, "time_start");
    },
  },
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