<template>
  <Layout :links="links">
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    links: [
      {
        image: require(`@/assets/icons/icon-settings.svg`),
        text: "Configuración",
        name: "school-editor",
      },
      {
        image: require(`@/assets/icons/icon-teacher.svg`),
        text: "Docentes",
        name: "school-editor-teachers",
      },
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Cursos",
        name: "school-editor-courses",
      },
      {
        image: require(`@/assets/icons/icon-classroom.svg`),
        text: "Aulas",
        name: "school-editor-grades",
      },
      {
        image: require(`@/assets/icons/icon-student.svg`),
        text: "Alumnos",
        name: "school-editor-students",
      },
      {
        image: require(`@/assets/icons/icon-session.svg`),
        text: "Sesiones",
        name: "school-editor-sessions",
      },
      {
        image: require(`@/assets/icons/icon-director.svg`),
        text: "Director",
        name: "school-editor-director",
      },
      {
        image: require(`@/assets/icons/icon-parent.svg`),
        text: "Padres",
        name: "school-editor-parents",
      },
    ],
  }),
  components: {
    Layout,
  },
};
</script>