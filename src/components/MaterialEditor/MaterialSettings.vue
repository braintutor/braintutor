<template>
  <div class="settings">
    <form @submit.prevent="saveMaterial()" class="m-card">
      <div class="m-card__body">
        <h3>Configuración</h3>
        <v-text-field
          v-model="material_clone.name"
          :maxlength="MaterialModel.name.max_length"
          :counter="MaterialModel.name.max_length"
          label="Nombre"
          class="mt-3"
          required
        ></v-text-field>
      </div>
      <div class="m-card__actions">
        <m-btn type="submit" color="primary" small>Guardar</m-btn>
      </div>
    </form>
    <div class="text-center mt-4">
      <m-btn @click="dlg_remove = true" color="error" small
        >Eliminar Material</m-btn
      >
    </div>

    <!-- dlg remove -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
              removeMaterial();
            "
            color="error"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { redirect } from "@/services/router.js";
import { updateMaterial, removeMaterial } from "@/services/materialService";

import MaterialModel from "@/models/Material";

export default {
  props: {
    material: Object,
    course: Object,
  },
  data: () => ({
    material_clone: {},
    //
    dlg_remove: false,
    MaterialModel,
  }),
  created() {
    this.material_clone = Object.assign({}, this.material);
  },
  methods: {
    async saveMaterial() {
      this.showLoading("Guardando");
      let material_id = this.material._id.$oid;
      let { name } = this.material_clone;
      try {
        await updateMaterial(material_id, name);
        this.material.name = name;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeMaterial() {
      this.showLoading("Eliminando");
      let material_id = this.material._id.$oid;
      let course_id = this.course._id.$oid;
      try {
        await removeMaterial(material_id);
        redirect("course-editor", { course_id });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // async saveImage() {
    //   this.showLoading("Guardando Imagen");
    //   let material_id = this.material._id.$oid;
    //   try {
    //     await updateMaterialImage(material_id, this.image_url);
    //     this.material.image = this.image_url;
    //   } catch (error) {
    //   this.showMessage("", error.msg || error);
    //   }
    //   this.hideLoading();
    // },
    // async onFileSelected() {
    //   this.showLoading("Subiendo Archivo");
    //   var data = new FormData();
    //   data.append("file", this.image_file);
    //   data.append("material_id", this.material._id.$oid);
    //   try {
    //     let res = await fetch(
    //       `${process.env.VUE_APP_API_URL}/uploadMaterialImage`,
    //       {
    //         method: "POST",
    //         body: data,
    //         headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //         },
    //       }
    //     );
    //     if (res.status === 413)
    //       throw { msg: "El archivo excede el tamaño de 1MB" };
    //     if (res.status >= 400 && res.status < 600) throw await res.json();

    //     let { url } = await res.json();
    //     this.image_url = url;
    //     await this.saveImage();
    //   } catch (error) {
    //   this.showMessage("", error.msg || error);
    //   }
    //   this.hideLoading();
    // },
  },
};
</script>

<style lang='scss' scoped>
.settings {
  max-width: 600px;
  margin: 0 auto;
}
</style>