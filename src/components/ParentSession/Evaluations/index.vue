<template>
  <div class="m-container">
    <EvaluationCard
      v-for="(evaluation, c_idx) in evaluations_filtered"
      :key="c_idx"
      :name="evaluation.name"
      :time_start="evaluation.time_start"
      :time_end="evaluation.time_end"
      class="mb-4"
    />

    <div v-show="evaluations_filtered.length <= 0" class="text-center">
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
    evaluations_filtered() {
      let evaluations = this.evaluations.map((e) => ({
        ...e,
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
      this.evaluations = await this.$api.evaluation.getAll(session_id);
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