<template>
  <div class="layout">
    <section class="list">
      <!-- Progress -->
      <div
        v-if="this.materials.length > 0 && this.progress_materials.length > 0"
        class="m-progress"
      >
        <div>
          <v-progress-circular
            :value="
              (this.progress_materials.length / this.materials.length) * 100
            "
            :size="24"
            :width="3"
            color="var(--color-active)"
            class="mr-3"
            rotate="270"
          >
            <!-- <v-icon small>mdi-trophy</v-icon> -->
          </v-progress-circular>
          <span v-if="this.progress_materials.length !== this.materials.length"
            >Tu progreso</span
          >
          <span v-else>Completado</span>
        </div>
        <v-icon @click="dlg_remove = true" style="opacity: 0.7"
          >mdi-sync</v-icon
        >
      </div>
      <!-- Units -->

        <MaterialReference :selectedMaterial="material" :isReadonly="true" :units="units" @selected="selectMaterial">
        <template v-slot:progress="{ material }">
           <div
              v-if="progress_materials.includes(material.id)"
              class="progress progress--complete"
            >
              <v-icon style="font-size: 1.25rem; opacity: 0.7"
                >mdi-check</v-icon
              >
            </div>
        </template>
        </MaterialReference>
  
    </section>
    <section class="list2">
      <div v-if="material" @click="show = !show" class="list2__menu">
        <template v-if="material.type === 'adaptative'">
          <v-icon style="font-size: 1.2rem" class="mb-1 mr-2">mdi-robot</v-icon>
          {{ material.name }}
        </template>
        <template v-else-if="material.type === 'file'">
          <v-icon style="font-size: 1.2rem" class="mb-1 mr-2"
            >mdi-paperclip</v-icon
          >
          {{ material.title }}
        </template>
        <v-icon class="list__show" :class="{ 'list__show--active': show }"
          >mdi-chevron-down</v-icon
        >
      </div>
      <div v-show="show">
        <section v-for="(u, u_idx) in units" :key="u_idx">
          <div class="list2__title">
            <span>{{ u.name }}</span>
          </div>
          <section
            v-for="(m, m_idx) in u.materials"
            :key="m_idx"
            @click="selectMaterial(m)"
            class="link"
            :class="{ 'link--active': m === material }"
          >
            <template v-if="m.type === 'adaptative'">
              <v-icon style="font-size: 1.2rem" class="mb-1 mr-2"
                >mdi-robot</v-icon
              >
              {{ m.title }}
            </template>
            <template v-else-if="m.type === 'type'">
              <v-icon style="font-size: 1.2rem" class="mb-1 mr-2"
                >mdi-paperclip</v-icon
              >
              {{ m.title }}
            </template>
          </section>
        </section>
      </div>
    </section>
    <!-- Material -->
    <div id="scroll" class="pa-3" style="overflow-y: auto; width: 100%">
      <div v-if="material" class="material">
        <FS
          v-if="material.type === 'adaptative'"
          :material="material"
          :categories="categories"
          @finish="saveProgress"
          @next="showNextMaterial"
        />
        <course-material
          v-if="material.type === 'file'"
          :material="material"
          @finish="saveProgress"
          @next="showNextMaterial"
        />
      </div>
    </div>
    <!-- Remove Progress -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Quieres reiniciar el progreso?</h3>
          <p class="mt-4">
            El progreso de este curso se reiniciará. ¿Quieres continuar?
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" small text class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
              removeProgress();
            "
            color="primary"
            small
            >Continuar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import FS from "./FS/index";
import CourseMaterial from "./CourseMaterial";
// import { getQuestionTemplate } from "@/services/chatService";
import {
  getCategoriesByLearningStyle,
  updateStudentProgress,
} from "@/services/studentService";
import { mapState, mapMutations } from "vuex";
import { processUnits } from "@/components/MaterialReference/util.js";
import  MaterialReference from "@/components/MaterialReference/List";

export default {
  props: {
    course: Object,
  },
  data: () => ({
    materials: [],
    units: [],
    progress_materials: [],
    categories: [],
    progress: [],
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
    ...mapMutations(["setMaterial", "show_chatbot", "knowledge"]),
    async init() {
      if (this.course._id) {
        this.showLoading("Cargando Material");
        let course_id = this.course._id.$oid;
        try {
          let [units, materials] = await Promise.all([
          this.$api.unit.getAll(course_id),
          this.$api.syllabus.byCourse(course_id)
        ]);

        
        this.units = processUnits(this.mongoArr(units), materials);
         // Validate Materials
          let progress_materials = (
            (
              (this.user.progress || []).find(
                (p) => p._id.$oid === course_id
              ) || {}
            ).materials || []
          ).map((p) => p.$oid); // get progress by course
          progress_materials = progress_materials.filter((pm) =>
            materials.map((m) => m.id).includes(pm)
          ); // map to only ids
          this.progress_materials = [...new Set(progress_materials)]; // remove duplicates
          this.materials = materials
          // Categories by Style
          let categories = [
            "explanation",
            "movies",
            "images",
            "examples",
            "exercises",
            "hyperlinks",
            // "faq",
          ];
          if (this.user.role === "STU") {
            let res = await getCategoriesByLearningStyle();
            categories = categories.filter((c) => res[c] && res[c].show);
          }
          this.categories = categories.concat(["quizzes"]);

         this.units = this.units.filter((u) => u.content.length > 0); // Only show units with materials
          if (this.units[0] && this.units[0].content[0])
            this.selectMaterial(this.units[0].content[0]);

          //Knowledge
          this.showLoading("Cargando Conocimiento");
          // knowledge base
          let knowledge = this.course.knowledge || [];
          const materialsKnowledge = await this.$api.course.getKnowledge(course_id)
          if (this.course.adaptive) {
            materialsKnowledge.forEach(( { id, data_fs }) => {
                data_fs.faq.forEach(({ question, answer }) => {
                  knowledge.push({
                    questions: [question],
                    answers: [answer],
                    actions: [
                      {
                        text: "Ver información",
                        action: () =>
                          this.selectMaterialByID(id, null),
                      },
                    ],
                  });
                });
            });
          } else {
            let questions = [
              "Muéstrame información sobre @.",
              "Háblame sobre @.",
              "Explícame sobre @.",
            ];
            materialsKnowledge.forEach(( { id, title }) => {
                knowledge.push({
                  questions: questions.map((question) =>
                    question.replace(/@/, title)
                  ),
                  answers: [
                    "Esto te puede servir.",
                    "He encontrado esta información.",
                  ],
                  actions: [
                    {
                      text: "Ver información",
                      action: () => this.selectMaterialByID(id, null),
                    },
                  ],
                });
            });
          }
          this.knowledge(knowledge);
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
    async saveProgress(material) {
      if (this.user.role === "STU") {
        let course_id = this.course._id.$oid;
        let new_material_id = material.id;
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
      let unit_idx = this.units.findIndex((c) => c._id === material.unit.id);
      let { content } = this.units[unit_idx];
      let material_idx = content.findIndex((m) => m.id === material.id);

      if (content.length > material_idx + 1) {
        this.selectMaterial(content[material_idx + 1]);
      } else if (this.units.length > unit_idx + 1) {
        content = this.units[unit_idx + 1].content;
        this.selectMaterial(content[0]);
      } else if (this.units[0]) this.selectMaterial(this.units[0].content[0]);
    },
    async selectMaterial( { material, unit } ) {
      this.setMaterial(null);
      this.show = false;
      const materialTemp = await this.$api.material.show(material.id)
      this.setMaterial({ ...materialTemp, unit });

    },
    selectMaterialByID(material_id, category) {
      // if (this.material && this.material._id === material_id) return;

      this.setMaterial(null);
      // this.material = null;
      this.show = false;
      setTimeout(() => {
        let material = this.materials.find((m) => m._id === material_id);
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
    FS,
    CourseMaterial,
    MaterialReference
  },
};
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
}

.list {
  overflow-y: auto;
  flex-shrink: 0;
  height: 100%;
  width: 320px;

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

.material-name {
  display: flex;
  justify-content: space-between;
  width: 100%;
}


.m-progress {
  margin-top: 6px;
  padding: 10px 12px;
  background: var(--background-active);
  font-size: 0.95rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  * {
    color: var(--color-active);
  }
}

.progress {
  position: relative;
  flex-shrink: 0;
  margin-right: 16px;
  height: 1rem;
  width: 1rem;
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
