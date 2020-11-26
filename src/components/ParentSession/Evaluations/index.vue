<template>
  <div>
    <div v-show="!evaluation_selected">
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

    <div v-if="evaluation_selected">
      <div class="m-menu">
        <div class="m-menu__left">
          <v-btn icon @click="evaluation_selected = null">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">{{ evaluation_selected.name }}</span>
        </div>
      </div>
      <Result :evaluation="evaluation_selected" :students="students" />
    </div>
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";
import Result from "./Results";

export default {
  data: () => ({
    evaluations: [],
    students: [],
    evaluation_selected: null,
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
      let session = this.mongo(await this.$api.session.get(session_id));
      this.students = this.mongoArr(
        await this.$api.student.getAll({
          grade_id: session.grade_id,
          section_id: session.section_id,
        })
      );
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
    Result,
  },
};
</script>