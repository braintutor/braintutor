<template>
  <div class="container">
    <AppSidebar :links="links">
      <loading :active="loading" :message="loading_msg" />

      <MaterialSettings :slot="0" :material="material" :course="course" />
      <CategoriesEditor :slot="1" :material="material" />
      <QuizzesEditor :slot="2" :material="material" />
    </AppSidebar>
  </div>
</template>

<script>
import loading from "@/components/loading";
import AppSidebar from "@/components/AppSidebar";
import MaterialSettings from "@/components/MaterialEditor/MaterialSettings";
import CategoriesEditor from "@/components/MaterialEditor/CategoriesEditor";
import QuizzesEditor from "@/components/MaterialEditor/QuizzesEditor";

import { getParam } from "@/services/router.js";
import { getMaterial } from "@/services/materialService";
import { getCourseByMaterial } from "@/services/courseService";
import { getCourseToken } from "@/services/firebaseStorageService";

import firebase from "firebase/app";
import "firebase/auth";

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
    material_id: "",
    material: {},
    course: {},
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Material";

    this.material_id = getParam("material_id");
    try {
      this.material = await getMaterial(this.material_id);
      this.course = await getCourseByMaterial(this.material_id);
      let { token } = await getCourseToken(this.course._id.$oid);
      firebase.auth().signInWithCustomToken(token);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }

    this.loading = false;
  },
  components: {
    loading,
    AppSidebar,
    MaterialSettings,
    CategoriesEditor,
    QuizzesEditor
  }
};
</script>

<style>
</style>