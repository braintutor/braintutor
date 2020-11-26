<template>
  <div class="m-container">
    <v-select
      v-model="student_id"
      :items="students"
      item-value="_id"
      item-text="name"
      label="Alumno"
      class="px-2 mb-3"
    ></v-select>
    <div v-show="!student_id" class="text-center">Seleccione un Alumno</div>

    <SessionCard
      v-for="session in sessions"
      :key="session._id"
      class="mb-3"
      :name="session.course.name"
      :user="`${session.teacher.last_name}, ${session.teacher.first_name}`"
      :buttons="[
        {
          text: 'Eventos',
          icon: 'mdi-calendar',
          color: 'primary',
          action: () => selectSession(session, 'events'),
        },
        {
          text: 'Tareas',
          icon: 'mdi-format-list-checks',
          color: 'success',
          action: () => selectSession(session, 'tasks'),
        },
        {
          text: 'Evaluaciones',
          icon: 'mdi-list-status',
          color: 'warning',
          action: () => selectSession(session, 'evaluations'),
        },
      ]"
    />
  </div>
</template>

<script>
import SessionCard from "@/components/globals/Session/SessionCard";

export default {
  data: () => ({
    students: [],
    student_id: null,
    sessions: [],
  }),
  watch: {
    async student_id() {
      this.$router
        .push({
          query: { student_id: this.student_id },
        })
        .catch(() => {});
      await this.getSessions(this.student_id);
    },
  },
  async created() {
    this.showLoading("Cargando Alumnos");
    let student_id = this.$route.query.student_id;
    try {
      this.students = this.mongoArr(await this.$api.student.getAll({}));
      this.students.forEach((student) => {
        student.name = `${student.last_name}, ${student.first_name}`;
      });
      if (this.students.map((s) => s._id).includes(student_id))
        this.student_id = student_id;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async getSessions(student_id) {
      if (!student_id) return;

      this.showLoading("Cargando Sesiones");
      try {
        let { grade_id, section_id } = this.students.find(
          (s) => s._id === student_id
        );
        this.sessions = this.mongoArr(
          await this.$api.session.getAll({ grade_id, section_id })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    selectSession(session, category) {
      this.$router.push({
        name: `parent-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: {
    SessionCard,
  },
};
</script>