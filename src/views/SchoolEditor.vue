<template>
  <Layout :links="links" :base="base">
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutLinks";

export default {
  data: () => ({
    base: "school-editor",
    links: [
      {
        image: require(`@/assets/icons/icon-settings.svg`),
        text: "Configuración",
        name: "",
      },
      {
        image: require(`@/assets/icons/icon-teacher.svg`),
        text: "Docentes",
        name: "teachers",
      },
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Cursos",
        name: "courses",
      },
      {
        image: require(`@/assets/icons/icon-classroom.svg`),
        text: "Aulas",
        name: "classrooms",
      },
      {
        image: require(`@/assets/icons/icon-student.svg`),
        text: "Alumnos",
        name: "students",
      },
      {
        image: require(`@/assets/icons/icon-session.svg`),
        text: "Sesiones",
        name: "sessions",
      },
      {
        image: require(`@/assets/icons/icon-director.svg`),
        text: "Director",
        name: "director",
      },
      {
        image: require(`@/assets/icons/icon-parent.svg`),
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