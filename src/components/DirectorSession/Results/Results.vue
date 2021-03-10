
<template>
  <EvaluationResults v-if="evaluation" :evaluation="evaluation" readOnly />
</template>
<script>
import EvaluationResults from "@/components/TeacherSession/EvaluationsEditor/EvaluationResults";
export default {
  watch: {
    $route: "init",
  },
  data: () => ({
    evaluation: null,
  }),
  created() {
    this.init();
  },
  methods: {
    init() {
      console.log(localStorage.getItem("evaluation"));
      this.evaluation = JSON.parse(localStorage.getItem("evaluation"));
    },
  },
  components: {
    EvaluationResults,
  },
};
</script>