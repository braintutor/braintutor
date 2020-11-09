<template>
  <div v-if="report" class="report">
    <div class="report__menu">
      <m-btn @click="save()" color="primary" small>Guardar</m-btn>
    </div>

    <div class="report__time mt-4">
      <span>Tiempo de Inicio:</span>
      <input type="datetime-local" v-model="report.time_start_f" />
      <span>Tiempo de Fin:</span>
      <input type="datetime-local" v-model="report.time_end_f" />
    </div>

    <DocumentEditor
      ref="document"
      :data="report.document"
      :document_type="'course'"
      :document_id="material.course_id.$oid"
      hideControls
      class="report__document my-5"
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
      let report = this.mongo(await this.$api.report.get(material_id));
      report.time_start_f = this.dateToInput(
        report.time_start ? report.time_start : new Date()
      );
      report.time_end_f = this.dateToInput(
        report.time_end ? report.time_end : new Date()
      );
      this.report = report;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando Cambios");

      let material_id = this.material._id.$oid;
      let document = await this.$refs["document"].getData();
      let time_start = new Date(this.report.time_start_f);
      let time_end = new Date(this.report.time_end_f);
      try {
        await this.$api.report.update({
          material_id,
          document,
          time_start,
          time_end,
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

<style lang='scss' scoped>
.report {
  max-width: 800px;
  margin: 0 auto;

  &__menu {
    display: flex;
    justify-content: flex-end;
  }

  &__time {
    max-width: 400px;

    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }

  &__document {
    padding: 20px;
    box-shadow: 0 2px 10px #ccc;
    border-radius: 6px;
  }
}
</style>