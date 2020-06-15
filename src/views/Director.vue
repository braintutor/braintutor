<template>
  <AppSidebar :links="links">
    <Classrooms :slot="0" />
    <Students :slot="1" />
    <div class="no-available" :slot="2">En Desarrollo</div>
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Classrooms from "@/components/Director/Classrooms/index";
import Students from "@/components/Director/Students";

export default {
  data: () => ({
    links: [
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png",
        text: "Aulas"
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png",
        text: "Alumnos"
      }
      // {
      //   image:
      //     "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
      //   text: "Cursos"
      // }
    ]
  }),
  components: {
    AppSidebar,
    Classrooms,
    Students
  }
};
</script>

<style lang='scss' scoped>
.no-available {
  margin-top: 20px;
  color: #b3b3b3;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>