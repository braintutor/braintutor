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

import { getSessionByTeacher } from "@/services/sessionService";

export default {
  data: () => ({
    course: {
      name: "...",
    },
    links: [
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Aprender",
        name: "session-editor-learn",
      },
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "session-editor-events",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "session-editor-tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "session-editor-evaluations",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Alumnos",
        name: "session-editor-students",
      },
    ],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando");
    try {
      let session = await getSessionByTeacher(session_id);
      this.course = session.course;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    redirectCourses() {
      this.$router.push({
        name: "sessions-teacher",
      });
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang='scss' scoped>
</style>