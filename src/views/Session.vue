<template>
  <Layout v-model="link_idx" :links="links" fluid>
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <router-view v-if="course._id" :course="course" :get="getStudents" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

import { redirect, getParam } from "@/services/router";
import { getSessionByStudent } from "@/services/sessionService";
import { getStudentsBySessionStudent } from "@/services/studentService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    course: {
      name: "...",
    },
    links: [],
    link_idx: 0,
  }),
  async created() {
    this.links = [
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        name: "Aprender",
        action: () => this.redirect(""),
      },
      {
        image:
          "https://limpiasol.com.ar/sitio/wp-content/uploads/2016/09/task-done-flat.png",
        name: "Tareas",
        action: () => this.redirect("tasks"),
      },
      {
        image: require("@/assets/braintutor/icon-event.png"),
        name: "Agenda",
        action: () => this.redirect("events"),
      },
      {
        image: require("@/assets/braintutor/icon-exam.png"),
        name: "Evaluaciones",
        action: () => this.redirect("evaluations"),
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        name: "Alumnos",
        action: () => this.redirect("students"),
      },
    ];

    let paths = window.location.href.split("/");
    let path = paths[paths.length - 1];
    console.log(path);
    this.link_idx = { tasks: 1, events: 2, evaluations: 3, students: 4 }[path];
    if (this.link_idx == null) this.link_idx = 0;

    //
    this.loading(true);
    this.loading_msg("Cargando");

    let session_id = getParam("session_id");

    try {
      let session = await getSessionByStudent(session_id);
      this.course = session.course;
    } catch (error) {
      this.$root.$children[0].showMessage(
        "",
        error.msg || "Ha ocurrido un error."
      );
    }

    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    redirectCourses() {
      redirect("sessions-student");
    },
    async getStudents() {
      let session_id = getParam("session_id");
      return await getStudentsBySessionStudent(session_id);
    },
    redirect(name) {
      let session_id = getParam("session_id");
      this.$router.push(`/session/${session_id}/${name}`).catch(() => {});
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang='scss' scoped>
</style>