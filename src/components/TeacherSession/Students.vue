<template>
  <div>
    <div class="menu pt-3">
      <m-btn
        @click="showStudents = true"
        :text="!showStudents"
        color="primary"
        small
        >Ver Alumnos</m-btn
      >
      <m-btn
        @click="showStudents = false"
        :text="showStudents"
        color="dark"
        small
        class="ml-2"
        >Ver Calendario</m-btn
      >
    </div>

    <Students v-show="showStudents" :students="students" class="m-container" />
    <EventsSessions
      v-show="!showStudents"
      :sessions="sessions"
      :showButtons="false"
    />
  </div>
</template>

<script>
import Students from "@/components/globals/Students/index";
import EventsSessions from "@/components/globals/Event/EventsSessions";

import { getStudentsBySession } from "@/services/studentService";

export default {
  data: () => ({
    students: [],
    sessions: [],
    events: [],
    showStudents: true,
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    try {
      this.showLoading("Cargando Alumnos");
      let session = this.mongo(await this.$api.session.get(session_id));
      this.showLoading("Cargando Eventos");
      this.students = this.mongoArr(await getStudentsBySession(session_id));
      this.sessions = this.mongoArr(
        await this.$api.event.getAll({
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
    EventsSessions,
  },
};
</script>

<style lang='scss' scoped>
.menu {
  width: max-content;
  margin: 0 auto;
}
</style>