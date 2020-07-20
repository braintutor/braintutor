<template>
  <div class="layout">
    <section class="list">
      <section v-for="(c, c_idx) in chatbots" :key="c_idx">
        <div @click="c.show = !c.show; $forceUpdate()" class="list__title">
          <span>{{c.name}}</span>
          <v-icon class="list__show" :class="{'list__show--active': c.show}">mdi-chevron-down</v-icon>
        </div>
        <div v-show="c.show">
          <section
            v-for="(m, m_idx) in c.materials"
            :key="m_idx"
            @click="selectMaterial(m)"
            class="link"
            :class="{'link--active': m === material}"
          >{{m.name}}</section>
        </div>
      </section>
    </section>

    <!-- Material -->
    <div id="scroll" style="overflow-y: auto; width: 100%; padding: 0 20px">
      <div v-if="material" class="material">
        <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>
        <MaterialCategories v-if="course.adaptive" :material="material" />
        <MaterialDocuments v-else :material="material" />
      </div>
    </div>

    <!-- Chatbot -->
    <Chatbot :knowledge="knowledge" />
  </div>
</template>

<script>
import MaterialCategories from "./MaterialCategories";
import MaterialDocuments from "./MaterialDocuments";
import Chatbot from "@/components/MChatbot/index";

import { getChatbotsByCourseTeacher } from "@/services/chatbotService";
import { getMaterialsByCourseTeacher } from "@/services/materialService";
import { getQuestionTemplate } from "@/services/chatService";

import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object
  },
  data: () => ({
    chatbots: [],
    materials: [],
    material: null,
    knowledge: []
  }),
  computed: {
    ...mapState(["user"])
  },
  async created() {
    await this.init();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async init() {
      if (this.course._id) {
        this.loading(true);
        this.loading_msg("Cargando Material");

        let course_id = this.course._id.$oid;
        try {
          this.chatbots = await getChatbotsByCourseTeacher(course_id);
          this.materials = await getMaterialsByCourseTeacher(course_id);

          if (this.materials[0]) this.selectMaterial(this.materials[0]);
          this.chatbots.forEach(c => {
            c.show = true;
            // Find Materials
            let materials = this.materials.filter(m => {
              return m.chatbot_id.$oid === c._id.$oid;
            });
            // Sorting Materials
            let order = (c.order || []).reverse();
            materials.sort((a, b) => {
              let a_order = order.indexOf(a._id.$oid);
              let b_order = order.indexOf(b._id.$oid);
              return b_order - a_order;
            });
            c.materials = materials;
          });

          //Knowledge
          this.loading_msg("Cargando Conocimiento");
          let knowledge = this.course.knowledge || [];

          // Knowledge Material
          if (this.course.adaptive) {
            let question_template = await getQuestionTemplate();
            this.materials.forEach(material => {
              Object.entries(question_template).forEach(
                ([category, questions]) => {
                  if (questions[0]) {
                    questions = questions.map(question =>
                      question.replace(/@/, material.name)
                    );
                    knowledge.push({
                      questions,
                      answers: [
                        "Esto te puede servir.",
                        "He encontrado esta información."
                      ],
                      material_id: material._id.$oid,
                      category
                    });
                  }
                }
              );
              material.faq.forEach(({ question, answer }) => {
                knowledge.push({
                  questions: [question],
                  answers: [answer],
                  material_id: material._id.$oid
                });
              });
            });
          } else {
            let questions = [
              "Muéstrame información sobre @.",
              '"Háblame sobre @.',
              "Explícame sobre @."
            ];
            this.materials.forEach(material => {
              knowledge.push({
                questions: questions.map(question =>
                  question.replace(/@/, material.name)
                ),
                answers: [
                  "Esto te puede servir.",
                  "He encontrado esta información."
                ],
                material_id: material._id.$oid
              });
            });
          }

          //Knowledge Formating
          knowledge.forEach(k => {
            if (k.material_id) {
              k.actions = [
                {
                  text: "Ver información",
                  action: () => {
                    this.selectMaterialByID(k.material_id, k.category);
                  }
                }
              ];
            }
          });
          this.knowledge = knowledge;
        } catch (error) {
          this.$root.$children[0].showMessage("Error", error.msg);
        }
        this.loading(false);
      }
    },
    selectMaterial(material) {
      this.material = null;
      setTimeout(() => {
        this.material = material;
      }, 100);
    },
    selectMaterialByID(material_id, category) {
      // if (this.material && this.material._id.$oid === material_id) return;

      this.material = null;
      setTimeout(() => {
        this.material = this.materials.find(m => m._id.$oid === material_id);
        this.material.default = category;
      }, 100);
    },
    unselectMaterial() {
      this.material = null;
    }
  },
  components: {
    MaterialCategories,
    MaterialDocuments,
    Chatbot
  }
};
</script>

<style lang='scss' scoped>
.layout {
  height: 100%;
}

.list {
  overflow-y: auto;
  flex-shrink: 0;
  height: 100%;
  width: 300px;
  background: #fafafa;

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;
    cursor: pointer;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__show {
    font-size: 2rem;
    border-radius: 50%;

    &:hover {
      background: #e5e5e5;
    }

    &:focus {
      outline: none;
    }

    &--active {
      transform: rotate(180deg);
    }
  }
}

.link {
  padding: 10px 12px;
  padding-left: 32px;
  font-size: 0.85rem;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
  }

  &--active {
    background: #e5e5e5;
    &:hover {
      background: #e5e5e5;
    }
  }
}

.material {
  margin: 20px auto;
  margin-bottom: 130px;
  max-width: 650px;

  &__menu {
    display: flex;
    align-items: center;
  }

  &__name {
    display: block;
    font-weight: bold;
    font-size: 1.5rem;
    letter-spacing: 0.25px;
  }
}
</style>