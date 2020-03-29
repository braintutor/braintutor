<template>
  <AppSidebar :links='links'>
    <TasksEditor :slot='0' />
    <Students :slot='1' />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import TasksEditor from "@/components/SessionEditor/TasksEditor/index";
import Students from "@/components/SessionEditor/Students";

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
      }
    ]
  }),
  async mounted() {},
  methods: {},
  components: {
    AppSidebar,
    TasksEditor,
    Students
  }
};
</script>

<style lang='scss' scoped>
</style>