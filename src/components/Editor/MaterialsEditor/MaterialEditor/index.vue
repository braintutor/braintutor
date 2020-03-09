<template>
  <div class="material-editor-container m-fullscreen">
    <loading :class="{active: loading}" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="loadMaterials()">
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
      <div class="menu-right">
        <!-- <v-btn icon @click="restoreMaterial(material._id.$oid)">
          <v-icon>mdi-restore</v-icon>
        </v-btn>-->
        <v-btn icon @click="saveMaterial()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_delete = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Material Content -->
    <Navigator class="py-2" :actions="actions" />
    <div class="material-editor-content m-fullscreen-content">
      <div class="container">
        <!-- Overview -->
        <OverviewEditor
          v-show="category_selected === 'overview'"
          ref="overview"
          class="category"
          :data="material.overview"
          :setCategoryValue="setCategoryValue"
        />
        <!-- Explanation -->
        <ExplanationEditor
          v-show="category_selected === 'explanation'"
          ref="explanation"
          class="category"
          :data="material.explanation"
          :setCategoryValue="setCategoryValue"
        />
        <!-- Bullets -->
        <div v-if="category_selected === 'bullets'" class="category">
          <div class="category-menu">
            <span>Puntos Importantes</span>
            <v-btn icon @click="addBullet(material.bullets)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(bullet, b_idx) in material.bullets" :key="b_idx">
            <v-textarea
              class="category-text"
              v-model="material.bullets[b_idx]"
              :rows="1"
              autoGrow
              dense
              hide-details
            ></v-textarea>
            <v-btn
              v-if="material.bullets.length > 1"
              icon
              @click="removeBullet(material.bullets, b_idx)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- Examples -->
        <div v-if="category_selected === 'examples'" class="category">
          <div class="category-menu">
            <span>Ejemplos</span>
            <v-btn icon @click="addExample(material.examples)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(example, e_idx) in material.examples" :key="e_idx">
            <v-textarea
              class="category-text"
              v-model="material.examples[e_idx]"
              :rows="1"
              autoGrow
              dense
              hide-details
            ></v-textarea>
            <v-btn
              v-if="material.examples.length > 1"
              icon
              @click="removeExample(material.examples, e_idx)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- Images -->
        <div v-if="category_selected === 'images'" class="category">
          <div class="category-menu">
            <span>Imágenes</span>
            <v-btn icon @click="addImage(material.images)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(image, i_idx) in material.images" :key="i_idx">
            <div class="category-bullet-content">
              <v-text-field
                class="category-text mb-2"
                v-model="material.images[i_idx]"
                :rows="1"
                autoGrow
                dense
                hide-details
              ></v-text-field>
              <div v-if="image" class="category-center">
                <img :src="image" />
              </div>
            </div>
            <v-btn
              v-if="material.images.length > 1"
              icon
              @click="removeImage(material.images, i_idx)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- Movies -->
        <div v-if="category_selected === 'movies'" class="category">
          <div class="category-menu">
            <span>Videos</span>
            <v-btn icon @click="addMovie(material.movies)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(movie, m_idx) in material.movies" :key="m_idx">
            <div class="category-bullet-content">
              <v-text-field
                class="category-text mb-2"
                v-model="material.movies[m_idx]"
                :rows="1"
                autoGrow
                dense
                hide-details
              ></v-text-field>
              <div v-if="movie" class="category-center">
                <div class="aspect-ratio-video">
                  <iframe class="aspect-ratio-content" :src="movie" allowfullscreen />
                </div>
              </div>
            </div>
            <v-btn
              v-if="material.movies.length > 1"
              icon
              @click="removeMovie(material.movies, m_idx)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- Exercises -->
        <div v-if="category_selected === 'exercises'" class="category">
          <div class="category-menu">
            <span>Ejercicios</span>
            <v-btn icon @click="addExercise(material.exercises)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(exercise, e_idx) in material.exercises" :key="e_idx">
            <div class="category-bullet-content">
              <div class="category-bullet">
                <v-textarea
                  class="category-text"
                  v-model="exercise.question"
                  :rows="1"
                  autoGrow
                  dense
                  hide-details
                ></v-textarea>
                <v-btn icon @click="addAlternative(material.exercises, e_idx)">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <v-radio-group v-model="exercise.correct">
                <div
                  class="category-bullet"
                  v-for="(alternative, a_idx) in exercise.alternatives"
                  :key="a_idx"
                >
                  <v-textarea
                    class="category-text"
                    v-model="exercise.alternatives[a_idx]"
                    :rows="1"
                    autoGrow
                    dense
                    hide-details
                  ></v-textarea>
                  <v-radio :value="a_idx"></v-radio>
                  <v-btn
                    v-show="exercise.alternatives.length > 2"
                    icon
                    @click="removeAlternative(exercise.alternatives, a_idx)"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </div>
              </v-radio-group>
            </div>
            <div style="width: min-content">
              <v-btn
                v-if="material.exercises.length > 1"
                icon
                @click="removeExercise(material.exercises, e_idx)"
              >
                <v-icon>mdi-close-circle-outline</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <!-- FAQ -->
        <div v-if="category_selected === 'faq'" class="category">
          <div class="category-menu">
            <span>Preguntas Frecuentes</span>
            <v-btn icon @click="addFAQ(material.faq)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(content, c_idx) in material.faq" :key="c_idx">
            <div class="category-bullet-content">
              <div class="category-bullet-item">
                <span class="category-title">Pregunta:</span>
                <v-text-field
                  class="category-text"
                  v-model="content.question"
                  :rows="1"
                  autoGrow
                  dense
                  hide-details
                ></v-text-field>
              </div>
              <div class="category-bullet-item">
                <span class="category-title">Respuesta:</span>
                <v-textarea
                  class="category-text"
                  v-model="content.answer"
                  :rows="1"
                  autoGrow
                  dense
                  hide-details
                ></v-textarea>
              </div>
            </div>
            <v-btn v-if="material.faq.length > 1" icon @click="removeFAQ(material.faq, c_idx)">
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
        <!-- Hyperlinks -->
        <div v-if="category_selected === 'hyperlinks'" class="category">
          <div class="category-menu">
            <span>Enlaces</span>
            <v-btn icon @click="addHyperlink(material.hyperlinks)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div
            class="category-bullet"
            v-for="(hyperlink, h_idx) in material.hyperlinks"
            :key="h_idx"
          >
            <div class="category-bullet-content">
              <div class="category-bullet-item">
                <span class="category-title">Nombre:</span>
                <v-text-field
                  class="category-text"
                  v-model="material.hyperlinks[h_idx].name"
                  dense
                  hide-details
                ></v-text-field>
              </div>
              <div class="category-bullet-item">
                <span class="category-title">Enlace:</span>
                <v-text-field
                  class="category-text"
                  v-model="material.hyperlinks[h_idx].link"
                  dense
                  hide-details
                ></v-text-field>
              </div>
            </div>
            <v-btn
              v-if="material.hyperlinks.length > 1"
              icon
              @click="removeHyperlink(material.hyperlinks, h_idx)"
            >
              <v-icon>mdi-close-circle-outline</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Dialog -->
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
import OverviewEditor from "./OverviewEditor";
import ExplanationEditor from "./ExplanationEditor";
import Navigator from "@/components/Navigator";
import loading from "@/components/loading";

import { updateMaterial } from "@/services/materialService";
import { Clamp } from "@/services/math";

export default {
  props: [
    "material",
    "unselectMaterial",
    "restoreMaterials",
    "deleteMaterial",
    "restoreMaterial"
  ],
  data: () => ({
    loading: false,
    dialog_delete: false,
    categories: [
      "overview",
      "explanation",
      "bullets",
      "examples",
      "images",
      "movies",
      "exercises",
      "faq",
      "hyperlinks"
    ],
    category_idx: 0
  }),
  computed: {
    category_selected() {
      return this.categories[this.category_idx];
    },
    actions() {
      return [
        {
          type: "icon",
          value: "mdi-chevron-left",
          callback: () => {
            this.changeCategory(-1);
          }
        },
        {
          type: "text",
          value: `${this.category_idx + 1}/${this.categories.length}`
        },
        {
          type: "icon",
          value: "mdi-chevron-right",
          callback: () => {
            this.changeCategory(1);
          }
        }
      ];
    }
  },
  methods: {
    changeCategory(direction) {
      this.category_idx = Clamp(
        this.category_idx + direction,
        0,
        this.categories.length - 1
      );
    },
    loadMaterials() {
      this.unselectMaterial();
      this.restoreMaterials();
    },
    setCategoryValue(attribute, value) {
      this.material[attribute] = value;
    },
    async saveMaterial() {
      this.loading = true;

      this.material.id = this.material._id.$oid;
      await Promise.all(
        ["overview", "explanation"].map(async category => {
          await this.$refs[category].save(); // Save all child components
        })
      );
      await updateMaterial(this.material);

      this.loading = false;
    },
    addBullet(bullets) {
      bullets.push("");
    },
    removeBullet(bullets, bullet_idx) {
      bullets.splice(bullet_idx, 1);
    },
    addHyperlink(hyperlinks) {
      hyperlinks.push({
        name: "",
        link: ""
      });
    },
    removeHyperlink(hyperlinks, hyperlink_idx) {
      hyperlinks.splice(hyperlink_idx, 1);
    },
    addExample(examples) {
      examples.push("");
    },
    removeExample(examples, example_idx) {
      examples.splice(example_idx, 1);
    },
    addExercise(exercises) {
      exercises.push({
        question: "",
        alternatives: ["", ""],
        correct: 0
      });
    },
    removeExercise(exercises, e_idx) {
      exercises.splice(e_idx, 1);
    },
    addAlternative(exercises, exercise_idx) {
      exercises[exercise_idx].alternatives.push("");
    },
    removeAlternative(alternatives, a_idx) {
      alternatives.splice(a_idx, 1);
    },
    addMovie(movies) {
      movies.push("");
    },
    removeMovie(movies, movie_idx) {
      movies.splice(movie_idx, 1);
    },
    addImage(images) {
      images.push("");
    },
    removeImage(images, image_idx) {
      images.splice(image_idx, 1);
    },
    addFAQ(faq) {
      faq.push({
        question: "",
        answer: ""
      });
    },
    removeFAQ(faq, c_idx) {
      faq.splice(c_idx, 1);
    }
  },
  components: {
    OverviewEditor,
    ExplanationEditor,
    Navigator,
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.material-editor-container {
  .material-editor-content {
    .category {
      padding: 12px;
      padding-bottom: 0;
      border-radius: 10px;
      @include box-shadow;
      .category-menu {
        font-size: 0.9rem;
        color: #afafaf;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          padding: 10px 0;
        }
      }
      .category-text {
        margin: 0;
        font-size: 1rem !important;
      }
      .category-bullet {
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        .category-bullet-content {
          width: 100%;
          padding: 10px 14px 0 14px;
          border-radius: 10px;
          @include box-shadow;
          .category-bullet-item {
            padding-bottom: 12px;
          }
        }
      }
      .category-center {
        margin: 20px auto;
        max-width: 800px;
        iframe {
          border: none;
          border-radius: 10px;
        }
        img {
          max-width: 100%;
          display: block;
          margin: 0 auto;
          border-radius: 10px;
        }
      }
      .category-title {
        font-weight: bold;
      }
    }
  }
}
</style>