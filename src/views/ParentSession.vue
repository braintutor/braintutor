<template>
  <Layout :links="links">
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    session_id: null,
    session: {},
    links: [
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "parent-session-events",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "parent-session-tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "parent-session-evaluations",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Alumnos",
        name: "parent-session-students",
      },
    ],
  }),
  components: {
    Layout,
  },
};
</script>