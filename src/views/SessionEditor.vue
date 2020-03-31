<template>
  <AppSidebar :links="links">
    <TasksEditor :slot="0" />
    <Students :slot="1" />
    <Chatbots :slot="2" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import TasksEditor from "@/components/SessionEditor/TasksEditor/index";
import Students from "@/components/SessionEditor/Students";
import Chatbots from "@/components/Session/Chatbots";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-task.png"),
        text: "Tareas"
      },
      {
        image: require("@/assets/braintutor/icon-students.png"),
        text: "Alumnos"
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Aprender"
      }
    ]
  }),
  async mounted() {},
  methods: {},
  components: {
    AppSidebar,
    TasksEditor,
    Students,
    Chatbots
  }
};
</script>

<style lang='scss' scoped>
</style>