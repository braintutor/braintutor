<template>
  <div class="settings">
    <form @submit.prevent="saveMaterial()" class="m-card">
      <div class="m-card__body">
        <h3>Configuración</h3>
        <v-text-field
          v-model="material_clone.title"
          :maxlength="MaterialModel.name.max_length"
          :counter="MaterialModel.name.max_length"
          label="Nombre"
          class="mt-3"
          required
        ></v-text-field>
        <v-checkbox
          v-model="material_clone.is_private"
          label="Privado (solo usted puede ver y editar este material)"
        ></v-checkbox>
      </div>
      <div class="m-card__actions">
        <m-btn type="submit" color="primary" small>Guardar</m-btn>
      </div>
    </form>
  </div>
</template>

<script>
import { updateMaterial } from "@/services/materialService";
import MaterialModel from "@/models/Material";

export default {
  props: {
    material: Object,
    course: Object,
  },
  data: () => ({
    material_clone: {},
    dlg_remove: false,
    MaterialModel,
  }),
  created() {
    this.material_clone = Object.assign({}, this.material);
  },
  methods: {
    async saveMaterial() {
      this.showLoading("Guardando");
      let material_id = this.material.id;
      let { title } = this.material_clone;
      try {
        await updateMaterial(
          material_id,
          title,
          this.material_clone.is_private
        );
        this.material.title = title;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    }
  },
};
</script>

<style lang='scss' scoped>
.settings {
  max-width: 600px;
  margin: 0 auto;
}

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>