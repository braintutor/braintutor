<template>
  <Students :students="students" class="m-container" />
</template>

<script>
import Students from "@/components/globals/Students/index";

import { getStudentsBySessionStudent } from "@/services/studentService";

export default {
  data: () => ({
    students: [],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Alumnos");
    try {
      this.students = this.mongoArr(
        await getStudentsBySessionStudent(session_id)
      );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Students,
  },
};
</script>

<style>
</style>