<template>
  <Layout :links="links">
    <loading :active="loading" :message="loading_msg" />

    <section class="path">
      <span>{{course.name}}</span>
    </section>

    <MaterialsEditor :slot="0" />
    <KnowledgeEditor :slot="1" :get="getKnowledge" :update="updateKnowledge" />
    <CourseSettings :slot="2" :course="course" />
  </Layout>
</template>

<script>
import loading from "@/components/loading";
import Layout from "@/components/Layout";
import MaterialsEditor from "@/components/CourseEditor/MaterialsEditor";
import KnowledgeEditor from "@/components/globals/KnowledgeEditor";
import CourseSettings from "@/components/CourseEditor/CourseSettings";

import { getParam } from "@/services/router.js";
import {
  getCourseByTeacher,
  updateCourseKnowledge
} from "@/services/courseService";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-material.png"),
        name: "Material"
      },
      {
        image: require("@/assets/braintutor/icon-knowledge.png"),
        name: "Conocimiento"
      },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        name: "Configuración"
      }
    ],
    course_id: "",
    course: {},
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Contenido";
    this.course_id = getParam("course_id");
    try {
      this.course = await getCourseByTeacher(this.course_id);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    async getKnowledge() {
      let { knowledge } = await getCourseByTeacher(this.course_id);
      return knowledge || [];
    },
    async updateKnowledge(knowledge) {
      return await updateCourseKnowledge(this.course_id, knowledge);
    }
  },
  components: {
    loading,
    Layout,
    MaterialsEditor,
    KnowledgeEditor,
    CourseSettings
  }
};
</script>

<style lang='scss' scoped>
.path {
  margin-bottom: 6px;
  color: #7a7a7a;
  font-size: 0.95rem;

  &__link {
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>