<template>
  <div>
    <h1 class="m-title">Configuración</h1>
    <div class="form">
      <div class="form__body">
        <span>Contenido Adaptativo</span>
        <v-switch v-model="adaptive" class="pa-0 ml-3"></v-switch>
      </div>
      <div class="form__actions">
        <v-btn @click="save()" small text outlined rounded>
          <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { updateCourseAdaptive } from "@/services/courseService";

export default {
  props: ["course"],
  data: () => ({
    adaptive: false,
  }),
  mounted() {
    this.adaptive = this.course.adaptive;
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      let course_id = this.course._id.$oid;
      try {
        await updateCourseAdaptive(course_id, this.adaptive);
        this.course.adaptive = this.adaptive;
        // this.showMessage("", "Guardado correctamente.");
      } catch (error) {
      this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
.m-title {
  margin: 0;
  margin-bottom: 8px;
  font-size: 1.6rem;
}

.form {
  font-size: 0.95rem;
  &__body {
    display: flex;
    align-items: center;
  }
  &__actions {
    margin-top: 10px;
  }
}
</style>