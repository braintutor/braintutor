<template>
  <Students :students="students" />
</template>

<script>
import Students from "@/components/globals/Students/index";

export default {
  data: () => ({
    students: [],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Alumnos");
    try {
      let session = this.mongo(await this.$api.session.get(session_id));
      this.students = this.mongoArr(
        await this.$api.student.getAll({
          grade_id: session.grade_id,
          section_id: session.section_id,
        })
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