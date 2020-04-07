<template>
  <AppSidebar :links="links">
    <Chatbots :slot="0" />
    <TasksEditor :slot="1" />
    <EvaluationsEditor :slot="2" />
    <Students :slot="3" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Chatbots from "@/components/Session/Chatbots";
import TasksEditor from "@/components/SessionEditor/TasksEditor/index";
import EvaluationsEditor from "@/components/SessionEditor/EvaluationsEditor/index";
import Students from "@/components/SessionEditor/Students";

export default {
  data: () => ({
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
        image:
          "https://www.jing.fm/clipimg/full/92-922422_go-live-handbook-icon-exam-png.png",
        text: "Evaluaciones"
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        text: "Alumnos"
      }
    ]
  }),
  async mounted() {},
  methods: {},
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