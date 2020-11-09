<template>
  <div v-if="material && report" class="report">
    <div class="report__menu">
      <m-btn @click="save()" color="primary" small>Guardar</m-btn>
    </div>

    <div class="report__time mt-4 mx-2">
      <strong>Título de la Unidad:</strong>
      <span>{{ material.name }}</span>
      <strong class="mt-1">Temporización:</strong>
      <v-text-field
        v-model="report.time"
        :maxlength="ReportModel.time.max_length"
        dense
        hide-details
      ></v-text-field>
      <strong>Fecha:</strong>
      <input type="datetime-local" v-model="report.time_start_f" />
      <!-- <strong class="mt-1">Grado y Sección:</strong>
      <v-text-field
        v-model="report.classroom"
        :maxlength="ReportModel.time.max_length"
        dense
        hide-details
      ></v-text-field> -->
      <strong>Docente:</strong>
      <span v-if="teacher">{{
        `${teacher.last_name}, ${teacher.first_name}`
      }}</span>
      <span v-else>...</span>
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

import ReportModel from "@/models/Report";

export default {
  data: () => ({
    material: null,
    report: null,
    teacher: null,
    ReportModel,
  }),
  async created() {
    this.showLoading("Cargando Reporte");
    let material_id = this.$route.params["material_id"];
    try {
      let [material, report] = await Promise.all([
        this.$api.material.get(material_id),
        this.$api.report.get(material_id),
      ]);

      this.material = this.mongo(material);
      report = this.mongo(report);

      report.time_start_f = this.dateToInput(
        report.time_start ? report.time_start : new Date()
      );
      this.report = report;
    } catch (error) {
      this.showMessage("", error.msg || "Ha ocurrido un error");
    }
    this.hideLoading();

    let course = await this.$api.course.get(this.material.course_id);
    this.teacher = course.teacher;
  },
  methods: {
    async save() {
      this.showLoading("Guardando Cambios");

      let material_id = this.$route.params["material_id"];
      let document = await this.$refs["document"].getData();
      let time = this.report.time;
      let time_start = new Date(this.report.time_start_f);

      try {
        await this.$api.report.update({
          material_id,
          document,
          time,
          time_start,
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
    // max-width: 400px;

    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }

  &__document {
    padding: 40px 20px;
    box-shadow: 0 2px 10px #ccc;
    border-radius: 6px;
  }
}
</style>