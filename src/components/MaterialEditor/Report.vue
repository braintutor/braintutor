<template>
  <div v-if="report">
    <DocumentEditor
      :data="report.document"
      @submit="save"
      :document_type="'course'"
      :document_id="material.course_id.$oid"
    />
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

export default {
  props: ["material"],
  data: () => ({
    report: null,
  }),
  async created() {
    this.showLoading("Cargando Reporte");
    let material_id = this.material._id.$oid;
    try {
      this.report = await this.$api.report.get(material_id);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save(document) {
      this.showLoading("Guardando Cambios");
      let material_id = this.material._id.$oid;
      try {
        await this.$api.report.update({
          material_id,
          document,
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    DocumentEditor,
  },
};
</script>

<style>
</style>