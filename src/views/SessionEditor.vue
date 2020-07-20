<template>
  <Layout :links="links" fluid>
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <!-- <Chatbots :slot="0" /> -->
    <Materials :slot="0" v-if="course._id" :course="course" />
    <TasksEditor class="m-container" :slot="1" />
    <EvaluationsEditor class="m-container" :slot="2" />
    <EventsEditor class="m-container" :slot="3" />
    <Students class="m-container" :slot="4" :get="getStudents" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
// import Chatbots from "@/components/Session/Chatbots";
import Materials from "@/components/SessionEditor/Materials/index";
import TasksEditor from "@/components/SessionEditor/TasksEditor/index";
import EvaluationsEditor from "@/components/SessionEditor/EvaluationsEditor/index";
import EventsEditor from "@/components/SessionEditor/EventsEditor/index";
import Students from "@/components/Students/index";

import { redirect, getParam } from "@/services/router";
import { getSessionByTeacher } from "@/services/sessionService";
import { getStudentsBySession } from "@/services/studentService";

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
        image: require("@/assets/braintutor/icon-exam.png"),
        name: "Evaluaciones"
      },
      {
        image: require("@/assets/braintutor/icon-event.png"),
        name: "Agenda"
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        name: "Alumnos"
      }
    ]
  }),
  async created() {
    this.loading(true);
    this.loading_msg("Cargando");

    let session_id = getParam("session_id");
    try {
      let session = await getSessionByTeacher(session_id);
      this.course = session.course;
    } catch (error) {
      this.$root.$children[0].showMessage("", error.msg);
    }

    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    redirectCourses() {
      redirect("sessions-teacher");
    },
    async getStudents() {
      return await getStudentsBySession(this.session_id);
    }
  },
  components: {
    Layout,
    // Chatbots,
    Materials,
    TasksEditor,
    EvaluationsEditor,
    EventsEditor,
    Students
  }
};
</script>

<style lang='scss' scoped>
</style>