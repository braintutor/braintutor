<template>
  <div class="material material-editor-container m-fullscreen">
    <loading :active="loading" :message="loading_message" />

    <!-- Material Content -->
    <div class="material-editor-content m-fullscreen-content">
      <Navigator class="py-2" :actions="actions" />
      <v-btn @click="saveMaterial()">
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
      <div class="container">
        <!-- Overview -->
        <div v-show="category_selected === 'overview'" class="category pb-3">
          <div class="category-menu">
            <span>Resumen</span>
          </div>
          <v-textarea
            class="category-text"
            v-model="material.overview"
            :rows="4"
            autoGrow
            dense
            hide-details
          ></v-textarea>
        </div>
        <!-- Explanation -->
        <div v-show="category_selected === 'explanation'" class="category">
          <div class="category-menu">
            <span>Explicación</span>
          </div>
          <ExplanationEditor ref="explanation" :data="material.explanation" />
        </div>
        <!-- Examples -->
        <div v-show="category_selected === 'examples'" class="category">
          <div class="category-menu">
            <span>Ejemplos</span>
          </div>
          <ExamplesEditor ref="examples" :data="material.examples" />
        </div>
        <!-- Movies -->
        <div v-show="category_selected === 'movies'" class="category">
          <div class="category-menu">
            <span>Videos</span>
          </div>
          <MoviesEditor ref="movies" :data="material.movies" />
        </div>
        <!-- Images -->
        <div v-if="category_selected === 'images'" class="category">
          <div class="category-menu">
            <span>Imágenes</span>
            <v-btn icon @click="addImage(material.images)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div
            class="category-bullet"
            v-for="(image, i_idx) in material.images"
            :key="image || i_idx"
          >
            <div class="category-bullet-content pa-2">
              <ImageUpload :image="image" :callback="image_iu => saveImage(image_iu, i_idx)" />
            </div>
            <v-menu v-if="material.images.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.images, i_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.images, i_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.images, i_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <!-- Exercises -->
        <div v-if="category_selected === 'exercises'" class="category">
          <div class="category-menu">
            <span>Ejercicios</span>
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" @click="addExercise(material.exercises)">
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>
              </template>
              <span style="font-size: .75rem">Agregar Pregunta</span>
            </v-tooltip>
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
            <v-menu v-if="material.exercises.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="moveUp(material.exercises, e_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.exercises, e_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.exercises, e_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
            <v-menu v-if="material.faq.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.faq, c_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.faq, c_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.faq, c_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
            <v-menu v-if="material.hyperlinks.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.hyperlinks, h_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.hyperlinks, h_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.hyperlinks, h_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ExplanationEditor from "./ExplanationEditor";
import ExamplesEditor from "./ExamplesEditor";
import MoviesEditor from "./MoviesEditor";

import Navigator from "@/components/Navigator";
import loading from "@/components/loading";
import ImageUpload from "@/components/ImageUpload";

import { updateMaterial } from "@/services/materialService";
import { Clamp } from "@/services/math";
import { getParam } from "@/services/router.js";

export default {
  props: ["material"],
  data: () => ({
    chatbot_id: "",
    categories: [
      "overview",
      "explanation",
      "movies",
      "images",
      "examples",
      "exercises",
      "hyperlinks",
      "faq"
    ],
    category_idx: 0,
    //
    loading: false,
    loading_message: ""
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
  mounted() {
    this.chatbot_id = getParam("chatbot_id");
  },
  methods: {
    changeCategory(direction) {
      this.category_idx = Clamp(
        this.category_idx + direction,
        0,
        this.categories.length - 1
      );
    },
    async saveMaterial() {
      this.loading = true;
      this.loading_message = "Guardando Material";

      this.material.id = this.material._id.$oid;
      try {
        for (let category of ["explanation", "examples", "movies"]) {
          let data = await this.$refs[category].save(); // Save all child components
          let size = (data.length * 2) / 1000;
          if (size > 500) {
            //kB
            let categories = {
              explanation: "Explicación",
              examples: "Ejemplos",
              movies: "Videos"
            };
            throw `Ha sobrepasado el exceso de tamaño en la categoría ${categories[category]}.`;
          }
          // console.log(`Saving ${size}kB in ${category}`);
          this.material[category] = data;
        }
        await updateMaterial(this.material);
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Guardar", error);
      }

      this.loading = false;
    },
    //
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        arr.splice();
      }
      this.$forceUpdate();
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        arr.splice();
      }
      this.$forceUpdate();
    },
    add(arr) {
      arr.push("");
    },
    remove(arr, idx) {
      arr.splice(idx, 1);
    },
    addHyperlink(hyperlinks) {
      hyperlinks.push({
        name: "",
        link: ""
      });
    },
    addExercise(exercises) {
      exercises.push({
        question: "",
        alternatives: ["", ""],
        correct: 0
      });
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
    addImage(images) {
      images.push("");
    },
    saveImage(image_iu, i_idx) {
      this.material.images[i_idx] = image_iu;
    },
    addFAQ(faq) {
      faq.push({
        question: "",
        answer: ""
      });
    }
  },
  components: {
    ExplanationEditor,
    ExamplesEditor,
    MoviesEditor,
    Navigator,
    loading,
    ImageUpload
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
          padding-bottom: 10px;
        }
      }
      .category-text {
        margin: 0;
        font-size: 1rem !important;
      }
      .category-bullet {
        display: flex;
        // align-items: center;
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