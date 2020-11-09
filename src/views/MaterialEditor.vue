<template>
  <Layout :links="links">
    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link"
        >Editar Cursos</span
      >
      <span class="m-path__icon">></span>
      <span @click="redirectCourse()" class="m-path__name m-path__name--link">{{
        course.name
      }}</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{ material.name }}</span>
    </section>

    <ContentEditor :slot="0" v-if="material._id" :material="material" />
    <!-- <QuizzesEditor :slot="1" :material="material" /> -->
    <Report :slot="1" />
    <MaterialSettings :slot="2" :material="material" :course="course" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import ContentEditor from "@/components/MaterialEditor/ContentEditor";
// import QuizzesEditor from "@/components/MaterialEditor/QuizzesEditor";
import Report from "@/components/MaterialEditor/Report";
import MaterialSettings from "@/components/MaterialEditor/MaterialSettings";

import { getParam, redirect } from "@/services/router.js";
import { getCourseByTeacher } from "@/services/courseService";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-material.png"),
        name: "Material",
      },
      {
        image: require("@/assets/braintutor/icon-quiz.png"),
        name: "Reporte",
      },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        name: "Configuración",
      },
    ],
    material: {
      name: "...",
    },
    course: {
      name: "...",
    },
  }),
  async created() {
    this.showLoading("Cargando Material");
    let material_id = getParam("material_id");
    try {
      this.material = await this.$api.material.get(material_id);
      let course_id = this.material.course_id.$oid;
      this.course = await getCourseByTeacher(course_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    redirectCourse() {
      redirect("course-editor", { course_id: this.course._id.$oid });
    },
    redirectCourses() {
      redirect("courses-editor");
    },
  },
  components: {
    Layout,
    ContentEditor,
    Report,
    // QuizzesEditor,
    MaterialSettings,
  },
};
</script>