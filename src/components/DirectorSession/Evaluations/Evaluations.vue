<template>
  <div>
    <EvaluationList
      v-if="!show_results"
      :evaluations="evaluations_filtered"
      :hasShow="false"
      :hasTime="false"
      :hasDelete="false"
      @showResults="showResults"
    >
    </EvaluationList>

    <!-- EVALUATION RESULTS -->
    <div v-if="show_results" class="m-container">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="show_results = false">
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
import EvaluationList from "@/components/TeacherSession/EvaluationsEditor/List";
import EvaluationResults from "@/components/TeacherSession/EvaluationsEditor/EvaluationResults";
export default {
  props: {
    type: String,
  },
  data: () => ({
    evaluations: [],
    evaluation_selected: null,
    show_results: false,
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
      this.evaluations = await this.$api.evaluation.getAll(
        session_id,
        this.type
      );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async showResults(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        this.evaluation_selected = evaluation;
        this.show_results = true;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    EvaluationList,
    EvaluationResults,
  },
};
</script>