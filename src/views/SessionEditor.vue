<template>
  <div>
    <div class="history">
      <span class="history__back" @click="redirect()">Cursos</span>
      <span class="history__divider">></span>
      <span v-if="course">{{course.name}}</span>
      <span v-else>...</span>
    </div>
    <AppSidebar :links="links">
      <Chatbots :slot="0" />
      <TasksEditor :slot="1" />
      <EvaluationsEditor :slot="2" />
      <Students :slot="3" />
    </AppSidebar>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Chatbots from "@/components/Session/Chatbots";
import TasksEditor from "@/components/SessionEditor/TasksEditor/index";
import EvaluationsEditor from "@/components/SessionEditor/EvaluationsEditor/index";
import Students from "@/components/SessionEditor/Students";

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
        image: require("@/assets/braintutor/icon-task.png"),
        text: "Tareas"
      },
      {
        image: require("@/assets/braintutor/icon-exam.png"),
        text: "Evaluaciones"
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        text: "Alumnos"
      }
    ]
  }),
  async mounted() {
    let session_id = getParam("session_id");
    this.course = await getCourseNameBySession(session_id);
  },
  methods: {
    redirect() {
      redirect("teacher");
    }
  },
  components: {
    AppSidebar,
    Chatbots,
    TasksEditor,
    EvaluationsEditor,
    Students
  }
};
</script>

<style lang='scss' scoped>
</style>