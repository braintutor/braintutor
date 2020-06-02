<template>
  <div class="container pa-0">
    <div class="history">
      <span class="history__back" @click="redirect()">Cursos</span>
      <span class="history__divider">></span>
      <span v-if="course">{{course.name}}</span>
      <span v-else>...</span>
    </div>
    <AppSidebar :links="links">
      <Chatbots :slot="0" />
      <Tasks :slot="1" />
      <Events :slot="2" />
      <Evaluations :slot="3" />
    </AppSidebar>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Chatbots from "@/components/Session/Chatbots";
import Tasks from "@/components/Session/Tasks/index";
import Events from "@/components/Session/Events/index";
import Evaluations from "@/components/Session/Evaluations/index";

import { redirect, getParam } from "@/services/router";
import { getCourseNameBySession } from "@/services/courseService";

export default {
  data: () => ({
    course: null,
    links: [
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Aprender"
      },
      {
        image:
          "https://limpiasol.com.ar/sitio/wp-content/uploads/2016/09/task-done-flat.png",
        text: "Tareas"
      },
      {
        image: require("@/assets/braintutor/icon-event.png"),
        text: "Eventos"
      },
      {
        image: require("@/assets/braintutor/icon-exam.png"),
        text: "Evaluaciones"
      }
    ]
  }),
  async mounted() {
    let session_id = getParam("session_id");
    this.course = await getCourseNameBySession(session_id);
  },
  methods: {
    redirect() {
      redirect("sessions-student");
    }
  },
  components: {
    AppSidebar,
    Tasks,
    Chatbots,
    Events,
    Evaluations
  }
};
</script>

<style lang='scss' scoped>
</style>