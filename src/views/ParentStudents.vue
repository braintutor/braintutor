<template>
  <div class="m-container px-1">
    <Students :students="students" />
  </div>
</template>

<script>
import Students from "@/components/globals/Students/index";

import { getStudentsByParent } from "@/services/studentService";

export default {
  data: () => ({
    students: [],
  }),
  async created() {
    this.showLoading("Cargando Alumnos");
    try {
      this.students = this.mongoArr(await getStudentsByParent());
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