<template>
  <div class="container">
    <AppSidebar :links="links">
      <loading :active="loading" :message="loading_msg" />

      <CategoriesEditor :slot="0" :material="material" />
      <div :slot="1">Pruebas</div>
      <MaterialSettings :slot="2" :material="material" :course='course' />
    </AppSidebar>
  </div>
</template>

<script>
import loading from "@/components/loading";
import AppSidebar from "@/components/AppSidebar";
import CategoriesEditor from "@/components/MaterialEditor_/CategoriesEditor";
import MaterialSettings from "@/components/MaterialEditor_/MaterialSettings";

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
        image: require("@/assets/braintutor/icon-material.png"),
        text: "Material"
      },
      {
        image: require("@/assets/braintutor/icon-quiz.png"),
        text: "Pruebas"
      },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        text: "Configuración"
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
    CategoriesEditor,
    MaterialSettings
  }
};
</script>

<style>
</style>