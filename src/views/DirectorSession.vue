<template>
  <Layout :links="links">
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "director-session-events",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "director-session-tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "director-session-evaluations",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Alumnos",
        name: "director-session-students",
      },
    ],
  }),
  // async created() {
  //   let session_id = this.$router.currentRoute.params["session_id"];
  //   try {
  //     this.session = this.mongo(await this.$api.session.get(session_id));
  //   } catch (error) {
  //     this.showMessage("", error.msg || error);
  //   }
  // },
  components: {
    Layout,
  },
};
</script>