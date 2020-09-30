<template>
  <Layout :links="links">
    <router-view :session="session" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    session: {},
    links: [
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "director-session-tasks",
      },
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "director-session-events",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "director-session-evaluations",
      },
    ],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Evaluaciones");
    try {
      this.session = this.mongo(
        await this.$api.session.get(session_id)
      );
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Layout,
  },
};
</script>