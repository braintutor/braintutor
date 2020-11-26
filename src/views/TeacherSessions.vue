<template>
  <div class="mcontainer">
    <h1 class="mtitle mb-4">
      <v-icon class="mr-3" style="font-size: 2.4rem">mdi-bookshelf</v-icon>
      <span>Mis Cursos</span>
    </h1>

    <!-- Sessions -->
    <SessionCard
      v-for="session in sessions"
      :key="session._id"
      class="session mb-3"
      :name="session.course.name"
      :user="`${session.grade.name} - ${session.section.name}`"
      user_icon="mdi-account-multiple"
      :buttons="[
        {
          text: 'Aprender',
          icon: 'mdi-book',
          color: 'primary',
          action: () => selectSession(session, 'learn'),
        },
        {
          text: 'Eventos',
          icon: 'mdi-calendar',
          color: 'error',
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
import { mapState } from "vuex";

export default {
  data: () => ({
    sessions: [],
  }),
  computed: {
    ...mapState(["user"]),
  },
  async created() {
    this.showLoading("Cargando Cursos");
    try {
      this.sessions = this.mongoArr(
        await this.$api.session.getAll({
          teacher_id: this.user._id.$oid,
        })
      );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    selectSession(session, category) {
      this.$router.push({
        name: `teacher-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: {
    SessionCard,
  },
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
}

.mtitle {
  margin: 10px;
  color: #5b5b6a;
}
</style>