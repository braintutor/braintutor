<template>
  <div>
    <loading :active="loading" :message="loading_msg" />

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
import loading from "@/components/loading";

import { updateCourseAdaptive } from "@/services/courseService";

export default {
  props: ["course"],
  data: () => ({
    adaptive: false,
    //
    loading: false,
    loading_msg: ""
  }),
  mounted() {
    this.adaptive = this.course.adaptive;
  },
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";

      let course_id = this.course._id.$oid;

      try {
        await updateCourseAdaptive(course_id, this.adaptive);
        this.course.adaptive = this.adaptive;
        // this.$root.$children[0].showMessage("", "Guardado correctamente.");
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    }
  },
  components: {
    loading
  }
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