<template>
  <div class="container">
    <AppSidebar :links="links">
      <loading :active="loading" :message="loading_msg" />

      <MaterialSettings :slot="0" :material="material" :course="course" />
      <ContentEditor :slot="1" :material="material" />
      <QuizzesEditor :slot="2" :material="material" />
    </AppSidebar>
  </div>
</template>

<script>
import loading from "@/components/loading";
import AppSidebar from "@/components/AppSidebar";
import MaterialSettings from "@/components/MaterialEditor/MaterialSettings";
import ContentEditor from "@/components/MaterialEditor/ContentEditor";
import QuizzesEditor from "@/components/MaterialEditor/QuizzesEditor";

import { getParam } from "@/services/router.js";
import { getMaterial } from "@/services/materialService";
import { getCourseByMaterial } from "@/services/courseService";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        text: "Configuración"
      },
      {
        image: require("@/assets/braintutor/icon-material.png"),
        text: "Material"
      },
      {
        image: require("@/assets/braintutor/icon-quiz.png"),
        text: "Pruebas"
      }
    ],
    material: {},
    course: {},
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
  components: {
    loading,
    AppSidebar,
    MaterialSettings,
    ContentEditor,
    QuizzesEditor
  }
};
</script>

<style>
</style>