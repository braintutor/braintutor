<template>
  <div class="m-container py-3">
    <div class="session m-card">
      <div class="session__body m-card__body">
        <strong>Curso:</strong>
        <span>
          {{ course.name }}
        </span>
        <strong>Aula:</strong>
        <span>
          {{ classroom.name }}
        </span>
        <strong>Profesor:</strong>
        <span>
          {{ `${teacher.last_name}, ${teacher.first_name}` }}
        </span>
      </div>
    </div>

    <!-- Evaluations -->
    <div class="mt-3">
      <h2>Evaluaciones</h2>
      <div
        v-for="(evaluation, idx) in evaluations"
        :key="idx"
        class="evaluation m-card mt-3"
      >
        <div class="evaluation__body m-card__body">
          <p>{{ evaluation.name }}</p>
          <p>{{ evaluation.time_start }}</p>
          <p>{{ evaluation.time_end }}</p>
          <p>{{ evaluation.content }}</p>
          <p>{{ evaluation.results }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getParam } from "@/services/router";

export default {
  data: () => ({
    session: {},
    course: {},
    classroom: {},
    teacher: {},
    evaluations: [],
  }),
  async created() {
    let session_id = getParam("session_id");

    this.showLoading("Cargando");
    try {
      this.session = this.mongo(await this.$api.session.get(session_id));
      this.course = this.session.course;
      this.classroom = this.session.classroom;
      this.teacher = this.session.teacher;

      this.evaluations = this.mongoArr(
        await this.$api.evaluation.getAll(session_id)
      );
      this.evaluations.forEach((e) => (e.results = this.mongoArr(e.results)));
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
};
</script>

<style lang='scss' scoped>
.session {
  width: max-content;
  margin: 0 auto;
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }
}

.evaluation {
  &__body {
  }
}
</style>