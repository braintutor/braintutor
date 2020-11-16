<template>
  <div class="m-container">
    <div v-show="!course_selected">
      <div
        v-for="(course, idx) in courses"
        :key="idx"
        class="course m-card mb-4"
      >
        <div class="course__body m-card__body">
          <strong>Curso:</strong>
          <span>{{ course.name }}</span>
          <strong v-if="course.teacher">Docente:</strong>
          <span v-if="course.teacher">{{
            `${course.teacher.last_name}, ${course.teacher.first_name}`
          }}</span>
        </div>
        <div class="m-card__actions">
          <m-btn @click="showReports(course)" color="primary" small text
            >Ver Reportes</m-btn
          >
        </div>
      </div>
    </div>

    <div v-if="course_selected">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="course_selected = null">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">{{ course_selected.name }}</span>
        </div>
      </div>
      <div class="mb-3">{{ course_selected }}</div>
      <!-- <input v-model="time_end" type="date" name="" id="" /> -->
      <div v-for="(report, idx) in reports" :key="idx" class="m-card mb-3">
        <div class="m-card__body">
          <p>{{ report.time_start }}</p>
          <p>{{ report }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    courses: [],
    course_selected: null,
    reports: [],
  }),
  async created() {
    this.showLoading("Cargando Cursos");
    try {
      this.courses = this.mongoArr(await this.$api.course.getAll());
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async showReports(course) {
      this.course_selected = course;
      this.reports = [];

      this.showLoading("Cargando Reportes");
      try {
        let date = new Date(2020, 10, 16);
        console.log(date.toString());

        this.reports = this.mongoArr(
          await this.$api.report.getAll({
            course_id: course._id,
            time_end: date.toISOString(),
          })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
.course {
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }
}
</style>