<template>
  <Layout :links="links">
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <Chatbots :slot="0" />
    <Tasks :slot="1" />
    <Events :slot="2" />
    <Evaluations :slot="3" />
    <Students :slot="4" :get="getStudents" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import Chatbots from "@/components/Session/Chatbots";
import Tasks from "@/components/Session/Tasks";
import Events from "@/components/Session/Events/index";
import Evaluations from "@/components/Session/Evaluations/index";
import Students from "@/components/Students/index";

import { redirect, getParam } from "@/services/router";
import { getCourseNameBySession } from "@/services/courseService";
import { getStudentsBySessionStudent } from "@/services/studentService";

export default {
  data: () => ({
    course: {
      name: "..."
    },
    session_id: "",
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
    this.session_id = getParam("session_id");
    this.course = await getCourseNameBySession(this.session_id);
  },
  methods: {
    redirectCourses() {
      redirect("sessions-student");
    },
    async getStudents() {
      return await getStudentsBySessionStudent(this.session_id);
    }
  },
  components: {
    Layout,
    Tasks,
    Chatbots,
    Events,
    Evaluations,
    Students
  }
};
</script>

<style lang='scss' scoped>
</style>