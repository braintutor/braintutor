<template>
  <Layout :links="links" :base="base" />
</template>

<script>
import Layout from "@/components/LayoutLinks";

export default {
  data: () => ({
    base: "school-editor",
    links: [
      {
        image: require(`@/assets/braintutor/icon-settings.png`),
        text: "Configuración",
        name: "",
      },
      {
        image:
          "https://cdn0.iconfinder.com/data/icons/back-to-school/90/school-learn-study-teacher-teaching-512.png",
        text: "Docentes",
        name: "teachers",
      },
      {
        image:
          "https://images.squarespace-cdn.com/content/v1/55d1e076e4b0be96a30dc726/1477412415649-WW90BD77ALIB9U99VTIA/ke17ZwdGBToddI8pDm48kDmvgM2_GYudIur22MWWiLdZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZamWLI2zvYWH8K3-s_4yszcp2ryTI0HqTOaaUohrI8PIvFa2r33EMaMk7hlBJBei4G1FTiqzsF6lpp3EXtW1YCk/image-asset.png",
        text: "Cursos",
        name: "courses",
      },
      {
        image:
          "https://iconsetc.com/icons-watermarks/flat-circle-white-on-red/iconathon/iconathon_flipped-classroom/iconathon_flipped-classroom_flat-circle-white-on-red_512x512.png",
        text: "Aulas",
        name: "classrooms",
      },
      {
        image:
          "https://icons.iconarchive.com/icons/graphicloads/100-flat/256/student-icon.png",
        text: "Alumnos",
        name: "students",
      },
      {
        image: require("@/assets/avatar/normal.png"),
        text: "Sesiones",
        name: "sessions",
      },
      {
        image:
          "https://www.kindpng.com/picc/m/475-4750705_school-administrator-icon-png-transparent-png.png",
        text: "Director",
        name: "director",
      },
      {
        image:
          "https://www.kindpng.com/picc/m/475-4750705_school-administrator-icon-png-transparent-png.png",
        text: "Padres",
        name: "parents",
      },
    ],
  }),
  components: {
    Layout,
  },
};
</script>