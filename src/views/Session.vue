<template>
  <Layout :links="links" fluid>
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <Materials :slot="0" v-if="course._id" :course="course" />
    <Tasks :slot="1" class="m-container py-3" />
    <Events :slot="2" class="m-container py-3" />
    <Evaluations :slot="3" class="m-container py-3" />
    <Students :slot="4" :get="getStudents" class="m-container py-3" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Materials from "@/components/Materials/index";
import Tasks from "@/components/Session/Tasks";
import Events from "@/components/Session/Events/index";
import Evaluations from "@/components/Session/Evaluations/index";
import Students from "@/components/Students/index";

import { redirect, getParam } from "@/services/router";
import { getSessionByStudent } from "@/services/sessionService";
import { getStudentsBySessionStudent } from "@/services/studentService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    course: {
      name: "..."
    },
    links: [
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        name: "Aprender"
      },
      {
        image:
          "https://limpiasol.com.ar/sitio/wp-content/uploads/2016/09/task-done-flat.png",
        name: "Tareas"
      },
      {
        image: require("@/assets/braintutor/icon-event.png"),
        name: "Agenda"
      },
      {
        image: require("@/assets/braintutor/icon-exam.png"),
        name: "Evaluaciones"
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        name: "Alumnos"
      }
    ]
  }),
  async mounted() {
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
    }
  },
  components: {
    Layout,
    Tasks,
    Materials,
    Events,
    Evaluations,
    Students
  }
};
</script>

<style lang='scss' scoped>
</style>