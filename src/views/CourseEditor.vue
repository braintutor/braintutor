<template>
  <Layout :links="links" fluid>
    <section slot="header" class="m-path">
      <span
        @click="redirectCoursesEditor()"
        class="m-path__name m-path__name--link"
        >Editar Cursos</span
      >
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{ course.name }}</span>
    </section>

    <router-view :get="getKnowledge" :update="updateKnowledge" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

import {
  getCourseByTeacher,
  updateCourseKnowledge,
} from "@/services/courseService";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/icons/icon-course.svg"),
        text: "Material",
        name: "course-editor",
      },
      {
        image: require("@/assets/icons/icon-knowledge.svg"),
        text: "Conocimiento",
        name: "course-editor-knowledge",
      },
      {
        image: require("@/assets/icons/icon-file.svg"),
        text: "Multimedia",
        name: "course-editor-files",
      },
      {
        image: require("@/assets/icons/icon-preview.svg"),
        text: "Vista previa",
        name: "course-editor-preview",
      },
    ],
    course_id: "",
    course: {
      name: "...",
    },
  }),
  async created() {
    this.course_id = this.$router.currentRoute.params["course_id"];
    try {
      this.course = await getCourseByTeacher(this.course_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
  },
  methods: {
    redirectCoursesEditor() {
      this.$router.push({
        name: "courses-editor",
      });
    },
    async getKnowledge() {
      let { knowledge } = await getCourseByTeacher(this.course_id);
      return knowledge || [];
    },
    async updateKnowledge(knowledge) {
      return await updateCourseKnowledge(this.course_id, knowledge);
    },
  },
  components: {
    Layout,
  },
};
</script>