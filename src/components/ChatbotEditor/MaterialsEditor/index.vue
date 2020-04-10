<template>
  <div>
    <loading :active="loading_materials" />
    <!-- Material List -->
    <v-container v-if="!material" fluid class="materials-container">
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
            :image="material.image"
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
      :unselectMaterial="unselectMaterial"
      :deleteMaterial="deleteMaterial"
      :restoreMaterial="restoreMaterial"
      :restoreMaterials="restoreMaterials"
    />
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import MaterialEditor from "./MaterialEditor/index";
import loading from "@/components/loading";

import {
  getMaterials,
  addMaterial,
  removeMaterial
} from "@/services/materialService";
import { getParam } from "@/services/router.js";

import firebase from "firebase";

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
    unselectMaterial() {
      this.material = null;
    },
    async restoreMaterials() {
      this.loading_materials = true;
      this.materials = await getMaterials(this.chatbot_id);
      this.loading_materials = false;
    },
    async createMaterial() {
      let overview = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Título", level: 2 } },
          { type: "paragraph", data: { text: "Descripción" } }
        ]
      });
      let explanation = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Título", level: 2 } },
          { type: "paragraph", data: { text: "Descripción" } }
        ]
      });

      if (!this.loading_create) {
        this.loading_materials = true;
        let new_material = {
          name: "Nombre",
          overview,
          explanation,
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
            },
            {
              question: "Pregunta 2",
              alternatives: ["Alternativa 1", "Alternativa 2"],
              correct: 0
            }
          ],
          movies: ["", ""],
          images: ["", ""],
          faq: [
            { question: "Pregunta Frecuente 1", answer: "Respuesta" },
            { question: "Pregunta Frecuente 2", answer: "Respuesta" }
          ]
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
      // var ref = firebase.storage().refFromURL(url_image);
      try {
        var ref = firebase.storage().ref(`/material/${material_id}/image`);
        await ref.delete();
      } catch (error) {
        //
      }
      await removeMaterial(material_id);
      await this.restoreMaterials();
    },
    selectMaterial(material) {
      this.material = material;
    },
    async restoreMaterial(material_id) {
      await this.restoreMaterials();
      this.material = this.materials.find(
        material => material._id.$oid == material_id
      );
    }
  },
  components: {
    Cartel,
    MaterialEditor,
    loading
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
  padding: 0;
  .material-container {
    padding: 8px;
  }
  .create-container {
    height: 100%;
    min-height: 180px;
    border: 2px solid #c2c2c2;
    border-style: dashed;
    border-radius: 10px;
    transition: all 0.3s;
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