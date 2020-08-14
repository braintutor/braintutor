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

    <section class="list2">
      <div v-if="material" @click="show = !show" class="list2__menu">
        <span>{{material.name}}</span>
        <v-icon class="list__show" :class="{'list__show--active': show}">mdi-chevron-down</v-icon>
      </div>
      <div v-show="show">
        <section v-for="(c, c_idx) in chatbots" :key="c_idx">
          <div class="list2__title">
            <span>{{c.name}}</span>
          </div>
          <section
            v-for="(m, m_idx) in c.materials"
            :key="m_idx"
            @click="selectMaterial(m)"
            class="link"
            :class="{'link--active': m === material}"
          >{{m.name}}</section>
        </section>
      </div>
    </section>

    <!-- Material -->
    <div id="scroll" class="pa-3" style="overflow-y: auto; width: 100%">
      <div v-if="material" class="material">
        <!-- <div class="material__menu">
          <span class="material__name">{{material.name}}</span>
        </div>-->
        <MaterialCategories v-if="course.adaptive" :material="material" :categories="categories" />
        <MaterialDocuments v-else :material="material" />
      </div>
    </div>
  </div>
</template>

<script>
import MaterialCategories from "./MaterialCategories";
import MaterialDocuments from "./MaterialDocuments";

import {
  getChatbotsByCourseTeacher,
  getChatbotsByCourseStudent,
} from "@/services/chatbotService";
import {
  getMaterialsByCourseTeacher,
  getMaterialsByCourseStudent,
} from "@/services/materialService";
import { getQuestionTemplate } from "@/services/chatService";
import { getCategoriesByLearningStyle } from "@/services/studentService";

import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object,
  },
  data: () => ({
    chatbots: [],
    materials: [],
    categories: [],
    //
    show: false,
  }),
  computed: {
    ...mapState(["user", "material"]),
  },
  async created() {
    this.show_chatbot(true);
    await this.init();
  },
  methods: {
    ...mapMutations([
      "loading",
      "loading_msg",
      "setMaterial",
      "show_chatbot",
      "loading_knowledge",
      "knowledge",
    ]),
    async init() {
      if (this.course._id) {
        this.loading(true);
        this.loading_msg("Cargando Material");
        this.loading_knowledge(true);

        let course_id = this.course._id.$oid;
        try {
          this.chatbots = await (this.user.role === "TEA"
            ? getChatbotsByCourseTeacher(course_id)
            : getChatbotsByCourseStudent(course_id));
          this.materials = await (this.user.role === "TEA"
            ? getMaterialsByCourseTeacher(course_id)
            : getMaterialsByCourseStudent(course_id));

          // Categories by Style
          let categories = [
            "explanation",
            "movies",
            "images",
            "examples",
            "exercises",
            "hyperlinks",
            "faq",
            "quizzes",
          ];
          if (this.user.role === "STU") {
            let res = await getCategoriesByLearningStyle();
            categories = categories.filter((c) => res[c] && res[c].show);
          }
          this.categories = categories;

          //Materials
          if (this.materials[0]) this.selectMaterial(this.materials[0]);
          this.chatbots.forEach((c) => {
            c.show = true;
            // Find Materials
            let materials = this.materials.filter((m) => {
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
            this.materials.forEach((material) => {
              Object.entries(question_template).forEach(
                ([category, questions]) => {
                  if (questions[0]) {
                    questions = questions.map((question) =>
                      question.replace(/@/, material.name)
                    );
                    knowledge.push({
                      questions,
                      answers: [
                        "Esto te puede servir.",
                        "He encontrado esta información.",
                      ],
                      actions: [
                        {
                          text: "Ver información",
                          action: () =>
                            this.selectMaterialByID(
                              material._id.$oid,
                              category
                            ),
                        },
                      ],
                    });
                  }
                }
              );
              material.faq.forEach(({ question, answer }) => {
                knowledge.push({
                  questions: [question],
                  answers: [answer],
                  actions: [
                    {
                      text: "Ver información",
                      action: () =>
                        this.selectMaterialByID(material._id.$oid, null),
                    },
                  ],
                });
              });
            });
          } else {
            let questions = [
              "Muéstrame información sobre @.",
              '"Háblame sobre @.',
              "Explícame sobre @.",
            ];
            this.materials.forEach((material) => {
              knowledge.push({
                questions: questions.map((question) =>
                  question.replace(/@/, material.name)
                ),
                answers: [
                  "Esto te puede servir.",
                  "He encontrado esta información.",
                ],
                actions: [
                  {
                    text: "Ver información",
                    action: () =>
                      this.selectMaterialByID(material._id.$oid, null),
                  },
                ],
              });
            });
          }
          this.knowledge(knowledge);
          this.loading_knowledge(false);
        } catch (error) {
          this.$root.$children[0].showMessage("Error", error.msg);
        }
        this.loading(false);
      }
    },
    selectMaterial(material) {
      this.setMaterial(null);
      // this.material = null;
      this.show = false;
      setTimeout(() => {
        material.default = null;
        this.setMaterial(material);
        // this.material = material;
      }, 100);
    },
    selectMaterialByID(material_id, category) {
      // if (this.material && this.material._id.$oid === material_id) return;

      this.setMaterial(null);
      // this.material = null;
      this.show = false;
      setTimeout(() => {
        let material = this.materials.find((m) => m._id.$oid === material_id);
        material.default = category;
        this.setMaterial(material);
        // this.material = material
      }, 100);
    },
    unselectMaterial() {
      this.setMaterial(null);
      // this.material = null;
      this.show = false;
    },
  },
  components: {
    MaterialCategories,
    MaterialDocuments,
  },
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

.list2 {
  display: none;
  background: #fafafa;

  &__menu {
    padding: 10px 20px;
    color: #8d8a8a;
    font-size: 1rem;

    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;
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
  margin: 0 auto 120px;
  max-width: 650px;

  // &__menu {
  //   display: flex;
  //   align-items: center;
  // }

  // &__name {
  //   display: block;
  //   font-weight: bold;
  //   font-size: 1.5rem;
  //   letter-spacing: 0.25px;
  // }
}

@media only screen and (max-width: 1000px) {
  .layout {
    flex-direction: column;
    height: auto;
  }

  .list {
    display: none;
  }
  .list2 {
    display: initial;
  }
}
</style>