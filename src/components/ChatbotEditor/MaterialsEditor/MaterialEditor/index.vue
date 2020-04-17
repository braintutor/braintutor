<template>
  <div class="material-editor-container m-fullscreen">
    <loading :active="loading" :message="loading_message" />
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
        <v-btn icon @click="dialog_image = true">
          <v-icon>mdi-image</v-icon>
        </v-btn>
        <v-btn icon @click="saveMaterial()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_delete = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Material Content -->
    <div class="material-editor-content m-fullscreen-content">
      <Navigator class="py-2" :actions="actions" />
      <div class="container">
        <!-- Overview -->
        <div v-show="category_selected === 'overview'" class="category">
          <div class="category-menu">
            <span>Resumen</span>
          </div>
          <OverviewEditor
            ref="overview"
            :data="material.overview"
            :setCategoryValue="setCategoryValue"
          />
        </div>
        <!-- Explanation -->
        <div v-show="category_selected === 'explanation'" class="category">
          <div class="category-menu">
            <span>Explicación</span>
          </div>
          <ExplanationEditor
            ref="explanation"
            :data="material.explanation"
            :setCategoryValue="setCategoryValue"
          />
        </div>
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
            <v-menu v-if="material.bullets.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.bullets, b_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.bullets, b_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.bullets, b_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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
            <v-menu v-if="material.examples.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.examples, e_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.examples, e_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.examples, e_idx)">
                  <v-list-item-title>Eliminar</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
        <!-- Images -->
        <!-- <div v-if="category_selected === 'images'" class="category">
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
        </div>-->
        <!-- Images -->
        <div v-if="category_selected === 'images'" class="category">
          <div class="category-menu">
            <span>Imágenes</span>
            <v-btn icon @click="addImage(material.images)">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>
          </div>
          <div class="category-bullet" v-for="(image, i_idx) in material.images" :key="image">
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
                  <iframe class="aspect-ratio-content" :src="embeds[m_idx]" allowfullscreen />
                </div>
              </div>
            </div>
            <v-menu v-if="material.movies.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="moveUp(material.movies, m_idx)">
                  <v-list-item-title>Mover Arriba</v-list-item-title>
                </v-list-item>
                <v-list-item @click="moveDown(material.movies, m_idx)">
                  <v-list-item-title>Mover Abajo</v-list-item-title>
                </v-list-item>
                <v-list-item @click="remove(material.movies, m_idx)">
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
            <v-menu v-if="material.exercises.length > 1" offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
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

    <!-- Dialog Image -->
    <v-dialog v-model="dialog_image" max-width="600">
      <v-card class="material-editor-image">
        <v-progress-linear v-if="image_progress != 0" :value="image_progress"></v-progress-linear>
        <div class="material-editor-image__menu">
          <v-text-field class="category-text mb-2" v-model="material.image" dense hide-details></v-text-field>
          <v-btn class="ml-2" @click="updateImage()" text icon>
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn onclick="upload_image.click()" text icon>
            <v-icon>mdi-upload</v-icon>
          </v-btn>
        </div>
        <v-file-input
          id="upload_image"
          @change="onFileSelected()"
          v-model="image_file"
          style="display:none"
        ></v-file-input>
        <img :src="material.image" alt />
      </v-card>
    </v-dialog>

    <!-- Dialog Delete -->
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
import ImageUpload from "@/components/ImageUpload";

import {
  updateMaterial,
  updateMaterialImage
} from "@/services/materialService";
import { getEmbed } from "@/services/embed";
import { Clamp } from "@/services/math";

import firebase from "firebase";

export default {
  props: [
    "material",
    "unselectMaterial",
    "restoreMaterials",
    "deleteMaterial",
    "restoreMaterial"
  ],
  data: () => ({
    image_file: {},
    image_progress: 0,
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
    category_idx: 0,
    //
    loading: false,
    loading_message: "",
    dialog_image: false,
    dialog_delete: false
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
    },
    embeds() {
      return this.material.movies.map(movie => getEmbed(movie));
    }
  },
  methods: {
    onFileSelected() {
      let ref = firebase
        .storage()
        .ref(`/material/${this.material._id.$oid}/image`);
      let task = ref.put(this.image_file);
      task.on(
        "state_changed",
        snapshot => {
          this.image_progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        () => {
          /* error */
        },
        () => {
          this.image_progress = 100;
          task.snapshot.ref.getDownloadURL().then(async url => {
            this.image_progress = 0;
            this.material.image = url;
            this.updateImage();
          });
        }
      );
    },
    async updateImage() {
      this.dialog_image = false;
      this.loading = true;
      this.loading_message = "Guardando Imagen";
      this.material.id = this.material._id.$oid;
      await updateMaterialImage(this.material);
      this.loading = false;
    },
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
      this.loading_message = "Guardando Material";

      this.material.id = this.material._id.$oid;
      await Promise.all(
        ["overview", "explanation"].map(async category => {
          await this.$refs[category].save(); // Save all child components
        })
      );
      await updateMaterial(this.material);

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
    addBullet(bullets) {
      bullets.push("");
    },
    addHyperlink(hyperlinks) {
      hyperlinks.push({
        name: "",
        link: ""
      });
    },
    addExample(examples) {
      examples.push("");
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
    OverviewEditor,
    ExplanationEditor,
    Navigator,
    loading,
    ImageUpload
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.material-editor-image {
  &__menu {
    padding: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: flex-end;
  }
  img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
}

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