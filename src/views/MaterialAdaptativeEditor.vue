<template>
  <Layout :links="links">
    <FSEditor :slot="0" :material="material" />
    <!-- <ReportEditor :slot="1" :material_id="material.id" /> -->
    <MaterialSettings :slot="1" :material="material" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout";
import FSEditor from "@/components/Material/MaterialAdaptativeEditor/FSEditor";
import MaterialSettings from "@/components/Material/MaterialAdaptativeEditor/MaterialSettings";

export default {
  data: () => ({
    links: [
      {
        image: require("@/assets/braintutor/icon-material.png"),
        name: "Material",
      },
      // {
      //   image: require("@/assets/braintutor/icon-quiz.png"),
      //   name: "Reporte",
      // },
      {
        image: require("@/assets/braintutor/icon-settings.png"),
        name: "Configuración",
      },
    ],
    material: {},
  }),
  async created() {
    this.showLoading("Cargando Material");
    let material_id = this.$route.params["material_id"];
    try {
      this.material = await this.$api.material.show(material_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Layout,
    FSEditor,
    MaterialSettings,
  },
};
</script>