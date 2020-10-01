<template>
  <div>
    <div v-show="!evaluation_selected">
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
          <m-btn
            @click="evaluation_selected = evaluation"
            color="primary"
            small
            text
            >Ver Resultados</m-btn
          >
        </div>
      </EvaluationCard>

      <div v-show="evaluations.length <= 0" class="text-center">
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
  props: {
    session: Object,
  },
  data: () => ({
    evaluations: [],
    students: [],
    evaluation_selected: null,
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Evaluaciones");
    try {
      this.evaluations = this.mongoArr(
        await this.$api.evaluation.getAll(session_id)
      );
      this.students = this.mongoArr(
        await this.$api.student.getAll(this.session.classroom_id)
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