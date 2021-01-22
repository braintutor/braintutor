<template>
  <form @submit.prevent="save()" class="school m-card">
    <div class="m-card__body">
      <h3>Horarios</h3>
      <input
        @change="onFileSelected($event)"
        onclick="value = null"
        type="file"
      />
    </div>
    <div class="m-card__actions">
      <m-btn color="primary" small>Guardar</m-btn>
    </div>
  </form>
</template>

<script>
import { getSchool } from "@/services/schoolService";
import { loadSchedule } from "@/services/scheduleService";
import SchoolModel from "@/models/School";

export default {
  data: () => ({
    links: [],
    school: {},
    SchoolModel,
    file: null,
  }),
  async mounted() {
    this.showLoading("Cargando Datos");
    try {
      this.school = await getSchool();
      this.school = this.mongo(this.school)
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        var formData = new FormData();
        formData.append("file", this.file);
        await loadSchedule(this.school._id, formData);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
      // if (!file) return;

      // this.showLoading("Guardando Cambios");
      // var formData = new FormData();
      // formData.append("file", file);

      // try {
      //   let { url } = await this.$api.school.updateImage(formData);
      //   this.school.image = url;
      // } catch (error) {
      //   this.showMessage("", error.msg || error);
      // }
      // this.hideLoading();
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