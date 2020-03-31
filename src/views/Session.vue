<template>
  <AppSidebar :links="links">
    <Tasks :slot="0" />
    <Chatbots :slot="1" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Tasks from "@/components/Session/Tasks/index";
import Chatbots from "@/components/Session/Chatbots";

export default {
  data: () => ({
    session_id: "",
    links: [
      {
        image: require("@/assets/braintutor/icon-task.png"),
        text: "Tareas"
      },
      {
        image: "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Aprender"
      }
    ]
  }),
  components: {
    AppSidebar,
    Tasks,
    Chatbots
  }
};
</script>

<style>
</style>