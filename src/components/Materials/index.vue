<template>
  <div class="layout">
    <section class="list">
      <!-- Progress -->
      <div class="m-progress">
        <div>
          <v-progress-circular
            :value="this.progress_materials.length/this.materials.length*100"
            :size="24"
            :width="3"
            color="#556aff"
            class="mr-3"
            rotate="270"
          >
            <!-- <v-icon small>mdi-trophy</v-icon> -->
          </v-progress-circular>
          <span v-if="this.progress_materials.length!==this.materials.length">Tu progreso</span>
          <span v-else>Completado</span>
        </div>
        <v-icon @click="dlg_remove = true" style="opacity: .6">mdi-sync</v-icon>
      </div>
      <!-- Chatbots -->
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
            :class="{'link--active': m && material && m._id.$oid === material._id.$oid}"
          >
            <div
              class="progress"
              :class="{'progress--complete': progress_materials.includes(m._id.$oid)}"
            >
              <v-icon
                v-if="progress_materials.includes(m._id.$oid)"
                style="font-size: 1.3rem"
              >mdi-check</v-icon>
            </div>
            <span>{{m.name}}</span>
          </section>
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
        <MaterialCategories
          v-if="course.adaptive"
          :material="material"
          :categories="categories"
          @finish="saveProgress"
          @next="showNextMaterial"
        />
        <MaterialDocuments v-else :material="material" />
      </div>
    </div>

    <!-- Remove Progress -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Quieres reiniciar el progreso?</h3>
          <p class="mt-4">El progreso de este curso se reiniciará. ¿Quieres continuar?</p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small text class="mr-2">Cancelar</m-btn>
          <m-btn @click="dlg_remove = false; removeProgress()" color="primary" small>Continuar</m-btn>
        </div>
      </div>
    </v-dialog>
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
import {
  getCategoriesByLearningStyle,
  updateStudentProgress,
} from "@/services/studentService";

import { mapState, mapMutations } from "vuex";

export default {
  props: {
    course: Object,
  },
  data: () => ({
    materials: [],
    chatbots: [],
    progress_materials: [],
    categories: [],
    progress: [],
    //
    dlg_remove: false,
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

          // Validate Materials
          let progress_materials = (
            (this.user.progress.find((p) => p._id.$oid === course_id) || {})
              .materials || []
          ).map((p) => p.$oid); // get progress by course
          progress_materials = progress_materials.filter((pm) =>
            this.materials.map((m) => m._id.$oid).includes(pm)
          ); // map to only ids
          this.progress_materials = [...new Set(progress_materials)]; // remove duplicates

          // Categories by Style
          let categories = [
            "explanation",
            "movies",
            "images",
            "examples",
            "exercises",
            "hyperlinks",
            "faq",
          ];
          if (this.user.role === "STU") {
            let res = await getCategoriesByLearningStyle();
            categories = categories.filter((c) => res[c] && res[c].show);
          }
          this.categories = categories.concat(["quizzes"]);

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
          this.chatbots = this.chatbots.filter((c) => c.materials.length > 0); // Only show chatbots with materials

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
          this.showMessage("", error.msg || error);
        }
        this.loading(false);
      }
    },
    async saveProgress(material) {
      if (this.user.role === "STU") {
        let course_id = this.course._id.$oid;
        let new_material_id = material._id.$oid;
        let materials = this.progress_materials;

        if (!materials.includes(new_material_id))
          materials.push(new_material_id);

        try {
          await updateStudentProgress(course_id, materials);
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      }
    },
    async removeProgress() {
      if (this.user.role === "STU") {
        this.showLoading("");
        let course_id = this.course._id.$oid;
        try {
          await updateStudentProgress(course_id, []);
          this.progress_materials = [];
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading("");
      }
    },
    showNextMaterial(material) {
      let chatbot_idx = this.chatbots.findIndex(
        (c) => c._id.$oid === material.chatbot_id.$oid
      );
      let { materials } = this.chatbots[chatbot_idx];
      let material_idx = materials.findIndex(
        (m) => m._id.$oid === material._id.$oid
      );

      if (materials.length > material_idx + 1) {
        this.selectMaterial(materials[material_idx + 1]);
      } else if (this.chatbots.length > chatbot_idx + 1) {
        materials = this.chatbots[chatbot_idx + 1].materials;
        this.selectMaterial(materials[0]);
      } else if (this.materials[0]) this.selectMaterial(this.materials[0]);
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

$color-list: #fff;
$color-hover: #f5f5f5b7;
$color-active: #ededff;
$color-active-font: #5553ff;

.list {
  overflow-y: auto;
  flex-shrink: 0;
  height: 100%;
  width: 300px;
  background: $color-list;

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
  margin: 8px;
  padding: 10px 12px;
  padding-left: 18px;
  color: #414141;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: 0.2s;
  cursor: pointer;

  display: flex;
  align-items: center;

  &:hover {
    background: $color-hover;
  }

  &--active {
    color: $color-active-font;
    background: $color-active;
    // font-weight: bold;
    &:hover {
      background: $color-active;
    }

    & * {
      color: $color-active-font;
    }
  }
}

$color-progress: rgb(172, 191, 255);

.m-progress {
  margin-top: 8px;
  padding: 10px 12px;
  background: $color-active;
  font-size: 0.95rem;
  border-radius: 6px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  * {
    color: $color-active-font;
  }
}

.progress {
  position: relative;
  flex-shrink: 0;
  margin-right: 16px;
  height: 1rem;
  width: 1rem;
  // border: 1px solid $color-progress;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;

  &--complete {
    border: none;
  }
}

.material {
  margin: 0 auto 80px;
  max-width: 800px;

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