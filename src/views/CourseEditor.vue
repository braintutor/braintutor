<template>
  <div class="container">
    <loading :active="loading" :message="loading_msg" />

    <!-- Course -->
    <section class="course">
      <p class="course__name">{{course.name}}</p>
      <div class="course__menu">
        <v-btn
          @click="show = 'MAT'"
          :outlined="show !== 'MAT'"
          class="mx-1"
          color="warning"
          small
          rounded
        >Material</v-btn>
        <v-btn
          @click="show = 'KNO'"
          :outlined="show !== 'KNO'"
          class="mx-1"
          color="primary"
          small
          rounded
        >Conocimiento</v-btn>
      </div>

      <!-- Course Material -->
      <section v-show="show === 'MAT'">
        <!-- Chatbot -->
        <section class="chatbot m-card" v-for="(chatbot, idx) in chatbots" :key="idx">
          <div class="chatbot__menu" @click="chatbot.show = !chatbot.show; $forceUpdate()">
            <p class="chatbot__name">{{chatbot.name}}</p>
            <v-btn v-if="chatbot.show" icon small>
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
            <v-btn v-else icon small>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </div>

          <!-- Material -->
          <div v-show="chatbot.show" class="materials">
            <!-- Material -->
            <div
              class="material m-card"
              v-for="(material, c_idx) in chatbot.materials"
              :key="c_idx"
              @click="selectMaterial(material._id.$oid)"
            >
              <img
                v-if="material.image"
                class="material__image"
                :src="material.image"
                :alt="material.name"
              />
              <div v-else class="material__image"></div>
              <p class="material__name">{{material.name}}</p>
              <p class="material__description">{{material.overview}}</p>
            </div>

            <!-- Material Create -->
            <div class="material--create" @click="createMaterial(chatbot)">+</div>
          </div>
        </section>
      </section>

      <!-- Course Knowledge -->
      <KnowledgeEditor
        v-show="show === 'KNO'"
        :get="getKnowledge"
        :update="updateKnowledge"
        :slot="1"
      />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import KnowledgeEditor from "@/components/globals/KnowledgeEditor";

import { getParam, redirect } from "@/services/router.js";
import { getCourseByTeacher } from "@/services/courseService";
import { getChatbotsByCourse } from "@/services/chatbotService.js";
import { getMaterials, addMaterial } from "@/services/materialService";
import { updateCourseKnowledge } from "@/services/knowledgeService";

export default {
  data: () => ({
    course: {},
    chatbots: [],
    show: "MAT",
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Contenido";
    this.course_id = getParam("course_id");

    try {
      this.course = await getCourseByTeacher(this.course_id);
      this.chatbots = await getChatbotsByCourse(this.course_id);

      // Materials
      for (let chatbot of this.chatbots) {
        let materials = await getMaterials(chatbot._id.$oid);
        materials.sort((a, b) => {
          let a_order = chatbot.order.indexOf(a._id.$oid);
          let b_order = chatbot.order.indexOf(b._id.$oid);
          return b_order - a_order;
        });
        chatbot.materials = materials;
      }
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    selectMaterial(material_id) {
      redirect("material-editor", { material_id });
    },
    async createMaterial(chatbot) {
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

      this.loading = true;
      this.loading_msg = "Creando Material";
      try {
        let material_id = await addMaterial(chatbot._id.$oid, new_material);
        new_material._id = material_id;
        chatbot.materials.push(new_material);
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }
      this.loading = false;
    },
    // Knowledge
    async getKnowledge() {
      let { knowledge } = await getCourseByTeacher(this.course_id);
      return knowledge || [];
    },
    async updateKnowledge(knowledge) {
      return await updateCourseKnowledge(this.course_id, knowledge);
    }
  },
  components: {
    loading,
    KnowledgeEditor
  }
};
</script>

<style lang='scss' scoped>
.course {
  &__menu {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
  &__name {
    margin-bottom: 10px;
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
  }
}

.chatbot {
  margin-bottom: 12px;

  &__menu {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
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
  margin-top: -12px;
}

.material {
  margin-top: 12px;

  display: grid;
  grid-template-columns: minmax(60px, 10%) auto;
  grid-template-rows: auto 1fr;

  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.005);
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