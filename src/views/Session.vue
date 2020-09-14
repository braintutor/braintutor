<template>
  <Layout :links="links" :base="base" fluid>
    <section slot="header" class="m-path">
      <span @click="redirect('sessions-student')" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <router-view v-if="course._id" :course="course" :get="getStudents" />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutLinks";

import { redirect, getParam } from "@/services/router";
import { getSessionByStudent } from "@/services/sessionService";
import { getStudentsBySessionStudent } from "@/services/studentService";

export default {
  data: () => ({
    course: {
      name: "...",
    },
    base: "",
    links: [],
  }),
  async created() {
    let session_id = getParam("session_id");
    this.base = `session/${session_id}`;
    this.links = [
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Aprender",
        name: "",
      },
      {
        image:
          "https://limpiasol.com.ar/sitio/wp-content/uploads/2016/09/task-done-flat.png",
        text: "Tareas",
        name: "tasks",
      },
      {
        image: require("@/assets/braintutor/icon-event.png"),
        text: "Agenda",
        name: "events",
      },
      {
        image: require("@/assets/braintutor/icon-exam.png"),
        text: "Evaluaciones",
        name: "evaluations",
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        text: "Alumnos",
        name: "students",
      },
    ];

    // Loading Session
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
    redirect,
    async getStudents() {
      let session_id = getParam("session_id");
      return await getStudentsBySessionStudent(session_id);
    },
  },
  components: {
    Layout,
  },
};
</script>