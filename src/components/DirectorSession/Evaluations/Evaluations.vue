<template>
  <div>
    <EvaluationList
      :evaluations="evaluations_filtered"
      @showResults="showResults"
    >
    </EvaluationList>

    <!-- EVALUATION RESULTS -->
    <!-- <EvaluationResults
      readOnly
      :evaluation="evaluation_selected"
    /> -->
  </div>
</template>

<script>
import EvaluationList from "@/components/TeacherSession/EvaluationsEditor/List";
export default {
  data: () => ({
    evaluations: [],
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
    this.fetchData();
  },
  watch: {
    $route: "fetchData",
  },
  methods: {
    async fetchData() {
      let session_id = this.$router.currentRoute.params["session_id"];
      this.showLoading("Cargando Evaluaciones");
      console.log(this.$route);
      let type = (this.$route.name + "").includes("tasks")
        ? "TASK"
        : "EVALUATION";
      try {
        this.evaluations = await this.$api.evaluation.getAll(session_id, type);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showResults(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        localStorage.setItem("evaluation", JSON.stringify(evaluation));
        this.$router.push({
          path: "results",
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    EvaluationList,
  },
};
</script>