<template>
  <Layout :links="links" :base="base" fluid>
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <router-view v-if="course._id" :course="course" :get="getStudents" />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutLinks";

import { redirect, getParam } from "@/services/router";
import { getSessionByTeacher } from "@/services/sessionService";
import { getStudentsBySession } from "@/services/studentService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    course: {
      name: "...",
    },
    base: "",
    links: [
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Aprender",
        name: "",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Evaluaciones",
        name: "evaluations",
      },
      {
        image: require("@/assets/icons/icon-calendar.svg"),
        text: "Agenda",
        name: "events",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Alumnos",
        name: "students",
      },
    ],
  }),
  async created() {
    let session_id = getParam("session_id");
    this.base = `session-editor/${session_id}`;

    //
    this.loading(true);
    this.loading_msg("Cargando");
    try {
      let session = await getSessionByTeacher(session_id);
      this.course = session.course;
    } catch (error) {
      this.showMessage(
        "",
        error.msg || "Ha ocurrido un error."
      );
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    redirectCourses() {
      redirect("sessions-teacher");
    },
    async getStudents() {
      let session_id = getParam("session_id");
      return await getStudentsBySession(session_id);
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang='scss' scoped>
</style>