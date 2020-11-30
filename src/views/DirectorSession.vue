<template>
  <Layout :links="links">
    <router-view v-if="course._id" :course="course" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    course: {},
    links: [
      // {
      //   image: require(`@/assets/icons/icon-course.svg`),
      //   text: "Aprender",
      //   name: "director-session-learn",
      // },
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
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    try {
      let session = this.mongo(await this.$api.session.get(session_id));
      this.course = session.course;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
  },
  components: {
    Layout,
  },
};
</script>