<template>
  <!-- Material List -->
  <v-container v-if="!material" fluid class="materials-container">
    <div class="loading-container" :class="{active: loading_materials}">
      <v-progress-circular :width="5" :size="120" indeterminate color="green"></v-progress-circular>
    </div>
    <v-row no-gutters>
      <v-col
        cols="6"
        sm="4"
        md="2"
        v-for="(material, r_idx) in materials"
        :key="r_idx"
        class="material-container"
      >
        <Cartel
          :description="material.name"
          :image="'https://besthqwallpapers.com/img/original/47929/4k-android-green-and-yellow-google-chrome-material-design.jpg'"
          :callback="() => selectMaterial(material)"
        />
      </v-col>
      <v-col cols="6" sm="4" md="2" class="material-container">
        <div class="create-container" @click="createMaterial()">
          <v-icon>mdi-plus</v-icon>
        </div>
      </v-col>
    </v-row>
  </v-container>
  <!-- Material Selected -->
  <MaterialEditor
    v-else
    :material="material"
    :restoreMaterials="restoreMaterials"
    :deleteMaterial="deleteMaterial"
  />
</template>

<script>
import Cartel from "@/components/Cartel";
import MaterialEditor from "./MaterialEditor";

import {
  getMaterials,
  addMaterial,
  removeMaterial
} from "@/services/materialService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    materials: [],
    material: null,
    chatbot_id: "",
    //
    loading_materials: true
  }),
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.restoreMaterials();
  },
  methods: {
    async restoreMaterials() {
      this.material = null;
      this.loading_materials = true;
      this.materials = await getMaterials(this.chatbot_id);
      this.loading_materials = false;
    },
    async createMaterial() {
      if (!this.loading_create) {
        this.loading_materials = true;
        let new_material = {
          name: "Nombre",
          overview: "Resumen",
          explanation: "Explicación",
          bullets: ["Punto 1", "Punto 2"],
          hyperlinks: [
            { name: "Enlace 1", link: "" },
            { name: "Enlace 2", link: "" }
          ],
          examples: ["Ejemplo 1", "Ejemplo 2"],
          exercises: [
            {
              question: "Pregunta 1",
              alternatives: ["Alternativa 1", "Alternativa 2"],
              correct: 0
            }
          ],
          movies: [],
          images: [],
          faq: [{ question: "Pregunta Frecuente 1", answer: "Respuesta" }]
        };
        let material_id = await addMaterial(this.chatbot_id, new_material);
        new_material._id = material_id;
        this.materials.push(new_material);
        this.selectMaterial(new_material);
        this.loading_materials = false;
      }
    },
    async deleteMaterial(material_id) {
      this.material = null;
      this.loading_materials = true;
      await removeMaterial(material_id);
      await this.restoreMaterials();
    },
    selectMaterial(material) {
      this.material = material;
    }
  },
  components: {
    Cartel,
    MaterialEditor
  }
};
</script>

<style lang="scss" scoped>
.loading-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: -20px;
  left: 0;
  background: #fff;
  opacity: 0;
  z-index: 1;
  transition: opacity 1s;
  pointer-events: none;
  //
  display: flex;
  justify-content: center;
  align-items: center;
  &.active {
    pointer-events: initial;
    opacity: 0.85;
  }
}
.materials-container {
  padding-bottom: 64px;
  .material-container {
    padding: 8px;
  }
  .create-container {
    height: 100%;
    border: 2px solid #c2c2c2;
    border-style: dashed;
    border-radius: 10px;
    transition: all .3s;
    //
    display: flex;
    justify-content: center;
    & * {
      color: #c2c2c2;
      font-size: 40px !important;
    }
    &:hover {
      cursor: pointer;
      background: #eeeeee;
    }
  }
}
</style>