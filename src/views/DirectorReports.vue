<template>
  <div class="m-container">
    <div
      v-for="(course, idx) in courses"
      :key="idx"
      @click="showReports(course._id)"
      class="m-card mb-4"
    >
      <p>Curso: {{ course.name }}</p>
      <p v-if="course.teacher">
        Docente:
        {{ `${course.teacher.last_name}, ${course.teacher.first_name}` }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    courses: [],
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
    async showReports(course_id) {
      this.showLoading("Cargando Reportes");
      try {
        let reports = this.mongoArr(
          await this.$api.report.getAll({ course_id })
        );
        console.log(reports);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>