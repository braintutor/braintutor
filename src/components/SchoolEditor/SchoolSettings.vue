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
      <input
        @change="onFileSelected($event)"
        onclick="value = null"
        type="file"
      />
      <div class="school__image my-4">
        <img :src="school.image" />
      </div>
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
    school_img: null,
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
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      this.showLoading("Guardando Cambios");
      var formData = new FormData();
      formData.append("file", file);

      try {
        let { url } = await this.$api.school.updateImage(formData);
        this.school.image = url;
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

  &__image {
    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }
}
</style>