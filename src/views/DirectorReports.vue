<template>
  <div class="m-container">
    <div v-for="(course, idx) in courses" :key="idx" class="m-card mb-4">
      <p>Curso: {{ course.name }}</p>
      <p v-if="course.teacher">
        Docente:
        {{ `${course.teacher.last_name}, ${course.teacher.first_name}` }}
      </p>

      <div>
        <p>Reportes:</p>
        <div>{{ course.reports }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    courses: [],
  }),
  async created() {
    this.courses = this.mongoArr(await this.$api.course.getAll());

    for (const course of this.courses) {
      let reports = this.mongoArr(
        await this.$api.report.getAll({
          course_id: course._id,
        })
      );
      course.reports = reports;
    }
    this.$forceUpdate();
  },
};
</script>