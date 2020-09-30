<template>
  <Layout :links="links">
    <router-view />
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
  components: {
    Layout,
  },
};
</script>