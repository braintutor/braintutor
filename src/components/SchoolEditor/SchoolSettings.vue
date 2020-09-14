<template>
  <form @submit.prevent="save()" class="school m-card">
    <div class="m-card__body">
      <h3>Configuración</h3>
      <v-text-field
        v-model="school.name"
        :maxlength="SchoolModel.name.max_length"
        label="Nombre"
        autocomplete="off"
        required
        class="mt-4"
      ></v-text-field>
    </div>
    <div class="m-card__actions">
      <m-btn color="primary" small>Guardar</m-btn>
    </div>
  </form>
</template>

<script>
import { getSchool, updateSchool } from "@/services/schoolService";
import SchoolModel from "@/models/School";

export default {
  data: () => ({
    links: [],
    school: {},
    //
    SchoolModel,
  }),
  async mounted() {
    this.showLoading("Cargando Datos");
    try {
      this.school = await getSchool();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        await updateSchool(this.school);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
.school {
  max-width: 600px;
  margin: 0 auto;
}
</style>