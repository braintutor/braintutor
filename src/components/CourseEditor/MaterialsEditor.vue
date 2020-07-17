<template>
  <div>
    <loading :active="loading" :message="loading_msg" />

    <div class="options">
      <v-btn @click="createChatbot()" small text rounded>
        <v-icon class="mr-2" small>mdi-plus</v-icon>Crear Unidad
      </v-btn>
    </div>

    <!-- Chatbot -->
    <section class="chatbot m-card" v-for="(chatbot, idx) in chatbots" :key="idx">
      <!-- <div class="chatbot__menu" @click="chatbot.show = !chatbot.show; $forceUpdate()"> -->
      <div class="chatbot__menu">
        <p v-if="!chatbot.edit_name" class="chatbot__name">{{chatbot.name}}</p>
        <v-text-field v-else class="chatbot__name" v-model="chatbot.name" hide-details dense></v-text-field>
        <div class="chatbot__options">
          <!-- <v-btn v-if="chatbot.show" icon small>
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn v-else icon small>
                <v-icon>mdi-chevron-down</v-icon>
          </v-btn>-->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-show="!chatbot.edit_name && !chatbot.edit_order"
                @click="selectChatbot(chatbot._id.$oid)"
                class="ml-2"
                icon
                small
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-robot</v-icon>
              </v-btn>
            </template>
            <span style="font-size: .75rem">Ver Chatbot</span>
          </v-tooltip>
          <v-menu v-if="!chatbot.edit_name && !chatbot.edit_order" offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-2" icon small v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0" dense>
              <v-list-item @click="chatbot.edit_name = true; $forceUpdate()">
                <v-list-item-title>Editar Nombre</v-list-item-title>
              </v-list-item>
              <v-list-item @click="chatbot.edit_order = true; $forceUpdate()">
                <v-list-item-title>Editar Orden</v-list-item-title>
              </v-list-item>
              <v-list-item @click="createMaterial(chatbot)">
                <v-list-item-title>Crear Material</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeChatbot(chatbot._id.$oid)">
                <v-list-item-title>Eliminar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            class="ml-2"
            v-show="chatbot.edit_name"
            @click="updateChatbotName(chatbot)"
            small
            text
            rounded
            outlined
          >
            Finalizar
            <v-icon class="ml-2" small>mdi-close</v-icon>
          </v-btn>
          <v-btn
            class="ml-2"
            v-show="chatbot.edit_order"
            @click="updateChatbotOrder(chatbot)"
            small
            text
            rounded
            outlined
          >
            Finalizar
            <v-icon class="ml-2" small>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Materials -->
      <div v-show="!chatbot.show" class="materials">
        <div v-for="(material, m_idx) in chatbot.materials" :key="m_idx">
          <!-- Material -->
          <div class="material">
            <div class="material__body m-card" @click="selectMaterial(material._id.$oid)">
              <img
                v-if="material.image"
                class="material__image"
                :src="material.image"
                :alt="material.name"
              />
              <div v-else class="material__image"></div>
              <p class="material__name">{{material.name}}</p>
              <p class="material__description">{{material.description}}</p>
            </div>
            <!-- Material Menu -->
            <div v-show="chatbot.edit_order" class="material__menu">
              <v-btn icon small @click="moveUp(chatbot.materials, m_idx)" :disabled="m_idx === 0">
                <v-icon>mdi-chevron-up</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                @click="moveDown(chatbot.materials, m_idx)"
                :disabled="m_idx === chatbot.materials.length - 1"
              >
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </div>
          </div>
        </div>

        <!-- Material Create -->
        <!-- <div
              v-show="!chatbot.edit_name && !chatbot.edit_order"
              @click="createMaterial(chatbot)"
              class="material--create"
        >+</div>-->
      </div>
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam, redirect } from "@/services/router.js";
import { scrollDown } from "@/services/scroll";
import {
  addChatbot,
  getChatbotsAndMaterials,
  updateChatbot,
  updateChatbotOrder,
  removeChatbot
} from "@/services/chatbotService.js";
import { addMaterial } from "@/services/materialService.js";

export default {
  data: () => ({
    course_id: "",
    chatbots: [],
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Contenido";
    this.course_id = getParam("course_id");

    try {
      this.chatbots = await getChatbotsAndMaterials(this.course_id);

      // Materials
      for (let chatbot of this.chatbots) {
        let order = (chatbot.order || []).reverse();
        chatbot.materials.sort((a, b) => {
          let a_order = order.indexOf(a._id.$oid);
          let b_order = order.indexOf(b._id.$oid);
          return b_order - a_order;
        });
      }
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }

    this.loading = false;
  },
  methods: {
    selectChatbot(chatbot_id) {
      redirect("chatbot", { chatbot_id });
    },
    async createChatbot() {
      this.loading = true;
      this.loading_msg = "Creando Unidad";

      let new_chatbot = {
        name: "Nombre"
      };

      try {
        let chatbot_id = await addChatbot(this.course_id, new_chatbot);
        new_chatbot._id = chatbot_id;
        new_chatbot.materials = [];
        this.chatbots.push(new_chatbot);
        setTimeout(() => scrollDown('app__body'), 100);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    },
    async removeChatbot(chatbot_id) {
      this.loading = true;
      this.loading_msg = "Eliminando Unidad";

      try {
        await removeChatbot(chatbot_id);
        this.chatbots = this.chatbots.filter(
          chatbot => chatbot._id.$oid !== chatbot_id
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    },
    selectMaterial(material_id) {
      redirect("material-editor", { material_id });
    },
    async createMaterial(chatbot) {
      let explanation = JSON.stringify({
        blocks: [
          { type: "header", data: { text: "Título", level: 2 } }
          // { type: "paragraph", data: { text: "Descripción" } }
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
      let images = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Imágenes", level: 2 } }]
      });
      let hyperlinks = JSON.stringify({
        blocks: [{ type: "header", data: { text: "Enlaces", level: 2 } }]
      });
      // Documents
      let documents = [
        JSON.stringify({
          blocks: [{ type: "header", data: { text: "Título", level: 2 } }]
        })
      ];
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

      let new_material = {
        name: "Nombre",
        description: "Descripción",
        overview: "Resumen",
        explanation,
        movies,
        images,
        hyperlinks,
        examples,
        exercises: quiz,
        faq: [{ question: "Pregunta", answer: "Respuesta" }],
        quizzes,
        documents
      };

      this.loading = true;
      this.loading_msg = "Creando Material";
      try {
        let material_id = await addMaterial(chatbot._id.$oid, new_material);
        new_material._id = material_id;
        chatbot.materials.push(new_material);
        // this.selectMaterial(material_id.$oid);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    async updateChatbotName(chatbot) {
      this.loading = true;
      this.loading_msg = "Guardando Cambios";
      try {
        chatbot.id = chatbot._id.$oid;
        await updateChatbot(chatbot);
        chatbot.edit_name = false;
      } catch (error) {
        this.$root.$children[0].showMessage("", "Error al Guardar");
      }
      this.loading = false;
    },
    // Chatbot Order
    async updateChatbotOrder(chatbot) {
      let order = chatbot.materials.map(material => material._id.$oid);
      this.loading = true;
      this.loading_msg = "Guardando Cambios";
      try {
        await updateChatbotOrder(chatbot._id.$oid, order);
        chatbot.edit_order = false;
      } catch (error) {
        this.$root.$children[0].showMessage("", "Error al Guardar");
      }
      this.loading = false;
    },
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        this.$forceUpdate();
      }
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        this.$forceUpdate();
      }
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.options {
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
}

.chatbot {
  margin-bottom: 16px;

  &__menu {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    // cursor: pointer;
  }

  &__name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
  }
}

.materials {
  padding: 18px;
  padding-top: 0;
  margin-top: -10px;
}

.material {
  margin-top: 12px;
  display: flex;

  &__body {
    flex-grow: 1;
    display: grid;
    grid-template-columns: minmax(60px, 10%) auto;
    grid-template-rows: auto 1fr;
    align-items: center;

    transition: 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.005);
    }
  }
  &__image {
    width: 100%;
    padding: 10px;

    grid-row-start: 1;
    grid-row-end: 3;
  }
  &__name {
    padding: 10px;
    padding-bottom: 0;
    margin: 0;
    font-weight: bold;
    font-size: 1rem;
  }
  &__description {
    padding: 10px;
    margin: 0;
    font-size: 0.9rem;
    white-space: pre-wrap;
  }
  &__menu {
    margin-left: 10px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }

  &--create {
    width: 100%;
    padding: 10px;
    margin-top: 12px;
    color: #c9c9c9;
    font-size: 1.6rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background: #f3f3f3;
    }
  }
}
</style>