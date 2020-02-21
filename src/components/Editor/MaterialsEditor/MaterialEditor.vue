<template>
  <div class="material-container">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="restoreMaterials()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-text-field
          class="menu-title"
          v-model="material.name"
          dense
          hide-details
          autocomplete="off"
        ></v-text-field>
      </div>
      <div v-if="!loading" class="menu-right">
        <v-btn icon @click="saveMaterial()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_delete = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-progress-circular :width="3" :size="20" indeterminate color="green"></v-progress-circular>
      </div>
    </div>

    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina este contenido, no podrá revertir los cambios.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn small depressed color="error" @click="deleteMaterial(material._id.$oid)">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { updateMaterial } from "@/services/materialService";

export default {
  props: ["material", "restoreMaterials", "deleteMaterial"],
  data: () => ({
    loading: false,
    dialog_delete: false
  }),
  methods: {
    async saveMaterial() {
      this.loading = true;
      this.material.id = this.material._id.$oid
      await updateMaterial(this.material)
      this.loading = false;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.material-container {
}

.menu {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .menu-title {
    margin: 0 12px;
    font-size: calc(9.5px + 1vw);
    font-weight: bold;
  }
  .menu-left {
    display: flex;
  }
  .menu-right {
  }
}
</style>