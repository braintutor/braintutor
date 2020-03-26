<template>
  <div>
    <AppSidebar :links="links">
      <div :slot="0">
        <h1>1</h1>
      </div>
      <div :slot="1">
        <h1>2</h1>
      </div>
    </AppSidebar>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
export default {
  data: () => ({
    links: [
      {
        image:
          "https://cdn0.iconfinder.com/data/icons/back-to-school/90/school-learn-study-teacher-teaching-512.png",
        text: "Mis Cursos"
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Editar Cursos"
      }
    ]
  }),
  components: {
    AppSidebar
  }
};
</script>

<style>
</style>