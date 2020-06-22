<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <!-- Material List -->
    <v-container v-if="!material" fluid class="materials-container">
      <div class="options">
        <v-btn v-if="edit_order" small text @click="updateChatbotOrder()">
          Finalizar
          <v-icon class="ml-2" style="font-size: 0.95rem">mdi-close</v-icon>
        </v-btn>
        <v-btn v-else small text color="primary" @click="edit_order = true">
          Editar Orden
          <v-icon class="ml-2" style="font-size: 0.95rem">mdi-pencil</v-icon>
        </v-btn>
      </div>
      <v-row no-gutters>
        <v-col
          cols="6"
          sm="4"
          md="3"
          v-for="(material, r_idx) in materials"
          :key="r_idx"
          class="material"
        >
          <Cartel
            class="material__body"
            :description="material.name"
            :image="material.image"
            :callback="() => selectMaterial(material)"
          />
          <div v-show="edit_order" class="material__actions">
            <v-btn small icon @click="moveLeft(materials, r_idx)">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <span>MOVER</span>
            <v-btn small icon @click="moveRight(materials, r_idx)">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col v-show="!edit_order" cols="6" sm="4" md="3" class="material">
          <div class="create-container" @click="createMaterial()">
            <v-icon>mdi-plus</v-icon>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <!-- Material Editor -->
    <MaterialEditor
      v-else
      :material="material"
      :unselect="unselect"
    />
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import MaterialEditor from "./MaterialEditor";
import loading from "@/components/loading";

import {
  getMaterials,
  addMaterial,
  removeMaterial
} from "@/services/materialService";
import {
  getChatbotNameOrder,
  updateChatbotOrder
} from "@/services/chatbotService";
import { getParam } from "@/services/router.js";

export default {
  data: () => ({
    materials: [],
    material: null,
    chatbot_id: "",
    //
    edit_order: false,
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.restoreMaterials();
  },
  methods: {
    selectMaterial(material) {
      this.material = material;
    },
    unselect() {
      this.material = null;
      this.restoreMaterials();
    },
    async restoreMaterials() {
      this.loading = true;
      this.loading_message = "Cargando Material";
      this.materials = [];

      let chatbot = await getChatbotNameOrder(this.chatbot_id);
      let order = (chatbot.order || []).reverse();

      let materials = await getMaterials(this.chatbot_id);
      materials.sort((a, b) => {
        let a_order = order.indexOf(a._id.$oid);
        let b_order = order.indexOf(b._id.$oid);
        return b_order - a_order;
      });
      this.materials = materials;

      this.loading = false;
    },
    async createMaterial() {
      let overview = "Resumen";
      let explanation = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Título", level: 2 } },
          { type: "paragraph", data: { text: "Descripción" } }
        ]
      });
      let examples = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Ejemplos", level: 2 } },
          {
            type: "list",
            data: { style: "unordered", items: ["Ejemplo 1", "Ejemplo 2"] }
          }
        ]
      });
      let movies = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Videos", level: 2 } }]
      });

      // Quizzes
      let quiz = [
        {
          question: "Pregunta",
          alternatives: ["Alternativa", "Alternativa"],
          correct: 0
        }
      ];
      let quizzes = {
        BAS: quiz,
        INT: quiz,
        ADV: quiz
      };

      if (!this.loading_create) {
        this.loading = true;
        let new_material = {
          name: "Nombre",
          overview,
          explanation,
          movies,
          bullets: ["Punto 1", "Punto 2"],
          hyperlinks: [
            { name: "Enlace 1", link: "" },
            { name: "Enlace 2", link: "" }
          ],
          examples,
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
          images: ["", ""],
          faq: [
            { question: "Pregunta Frecuente 1", answer: "Respuesta" },
            { question: "Pregunta Frecuente 2", answer: "Respuesta" }
          ],
          quizzes
        };
        let material_id = await addMaterial(this.chatbot_id, new_material);
        new_material._id = material_id;
        this.materials.push(new_material);
        this.selectMaterial(new_material);
        this.loading = false;
      }
    },
    async deleteMaterial(material_id) {
      this.material = null;
      this.loading = true;
      this.loading_message = "Eliminando Material";

      await removeMaterial(material_id);
      await this.restoreMaterials();
    },
    async restoreMaterial(material_id) {
      await this.restoreMaterials();
      this.material = this.materials.find(
        material => material._id.$oid == material_id
      );
    },
    // Chatbot Order
    async updateChatbotOrder() {
      this.loading = true;
      this.loading_message = "Guardando Cambios";
      let order = this.materials.map(material => material._id.$oid);
      try {
        await updateChatbotOrder(this.chatbot_id, order);
        this.edit_order = false;
      } catch (error) {
        this.$root.$children[0].showMessage("", "Error al Guardar");
      }
      this.loading = false;
    },
    moveLeft(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        arr.splice();
      }
    },
    moveRight(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        arr.splice();
      }
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
.options {
  margin-right: 8px;
  display: flex;
  justify-content: flex-end;
}

.materials-container {
  padding: 0;
  .create-container {
    height: 100%;
    min-height: 128px;
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

.material {
  padding: 8px;
  display: flex;
  flex-direction: column;

  &__body {
    height: 100%;
  }
  &__actions {
    margin-top: 10px;
    color: #747474;
    font-size: 0.75rem;
    font-weight: bold;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>