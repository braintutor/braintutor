<template>
  <Layout :links="links" fluid>
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link"
        >Cursos</span
      >
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{ course.name }}</span>
    </section>

    <router-view v-if="course._id" :course="course" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

import { getSessionByStudent } from "@/services/sessionService";

export default {
  data: () => ({
    course: {
      name: "...",
    },
    links: [
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Aprender",
        name: "student-session-learn",
      },
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "student-session-events",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "student-session-tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "student-session-evaluations",
      },
      {
        image: require("@/assets/icons/icon-message.svg"),
        text: "Mensajes",
        name: "student-session-messages",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Alumnos",
        name: "student-session-students",
      },
    ],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando");
    try {
      let session = await getSessionByStudent(session_id);
      this.course = session.course;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    redirectCourses() {
      this.$router.push({
        name: "student-sessions",
      });
    },
  },
  components: {
    Layout,
  },
};
</script>