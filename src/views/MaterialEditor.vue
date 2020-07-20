<template>
  <Layout :links="links">
    <loading :active="loading" :message="loading_msg" />

    <section slot="header" class="m-path">
      <span @click="redirectCourses()" class="m-path__name m-path__name--link">Editar Cursos</span>
      <span class="m-path__icon">></span>
      <span @click="redirectCourse()" class="m-path__name m-path__name--link">{{course.name}}</span>
      <span class="m-path__icon">></span>
      <span class="m-path__name">{{material.name}}</span>
    </section>

    <ContentEditor :slot="0" v-if="material._id" :material="material" :course="course" />
    <QuizzesEditor :slot="1" :material="material" />
    <MaterialSettings :slot="2" :material="material" :course="course" />
  </Layout>
</template>

<script>
import loading from "@/components/loading";
import Layout from "@/components/Layout";
import MaterialSettings from "@/components/MaterialEditor/MaterialSettings";
import ContentEditor from "@/components/MaterialEditor/ContentEditor";
import QuizzesEditor from "@/components/MaterialEditor/QuizzesEditor";

import { getParam, redirect } from "@/services/router.js";
import { getMaterial } from "@/services/materialService";
import { getCourseByMaterial } from "@/services/courseService";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-material.png"),
        name: "Material"
      },
      {
        image: require("@/assets/braintutor/icon-quiz.png"),
        name: "Pruebas"
      },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        name: "Configuración"
      }
    ],
    material: {
      name: "..."
    },
    course: {
      name: "..."
    },
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Material";

    let material_id = getParam("material_id");
    try {
      this.material = await getMaterial(material_id);
      this.course = await getCourseByMaterial(material_id);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }

    this.loading = false;
  },
  methods: {
    redirectCourse() {
      redirect("course-editor", { course_id: this.course._id.$oid });
    },
    redirectCourses() {
      redirect("courses-editor");
    }
  },
  components: {
    loading,
    Layout,
    MaterialSettings,
    ContentEditor,
    QuizzesEditor
  }
};
</script>

<style lang='scss' scoped>
</style>