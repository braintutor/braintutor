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
      class="mb-3"
      :session="session"
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

    <div v-show="sessions.length <= 0" class="text-center mt-3">
      No hay Sesiones
    </div>
  </div>
</template>

<script>
import SessionCard from "@/components/globals/Session/SessionCard";

// import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
  }),
  async mounted() {
    // GOOGLE
    // let fragmentString = location.hash.substring(1);
    // let params = {};
    // var regex = /([^&=]+)=([^&]*)/g,
    //   m;
    // while ((m = regex.exec(fragmentString))) {
    //   params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    // }
    // if (params.access_token)
    //   localStorage.setItem("access_token", params.access_token);

    // let state = params["state"] || params["/state"];
    // if (state) redirect("task", { task_id: state });

    //
    this.showLoading("Cargando Cursos");
    try {
      this.sessions = this.mongoArr(await this.$api.session.getAll({}));
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading(false);
  },
  methods: {
    selectSession(session, category) {
      this.$router.push({
        name: `student-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: { SessionCard },
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