<template>
  <Layout :links="links" :base="base" fluid>
    <section slot="header" class="m-path">
      <span
        @click="redirect('courses-editor')"
        class="m-path__name m-path__name--link"
      >Editar Cursos</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{course.name}}</span>
    </section>

    <router-view :get="getKnowledge" :update="updateKnowledge" />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutLinks";

import { getParam, redirect } from "@/services/router.js";
import {
  getCourseByTeacher,
  updateCourseKnowledge,
} from "@/services/courseService";

export default {
  data: () => ({
    base: "",
    links: [
      {
        image: require("@/assets/icons/icon-course.svg"),
        text: "Material",
        name: "",
      },
      {
        image: require("@/assets/icons/icon-knowledge.svg"),
        text: "Conocimiento",
        name: "knowledge",
      },
      {
        image: require("@/assets/icons/icon-preview.svg"),
        text: "Vista previa",
        name: "preview",
      },
    ],
    course_id: "",
    course: {
      name: "...",
    },
  }),
  async created() {
    this.course_id = getParam("course_id");
    this.base = `course-editor/${this.course_id}`;

    try {
      this.course = await getCourseByTeacher(this.course_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
  },
  methods: {
    redirect,
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