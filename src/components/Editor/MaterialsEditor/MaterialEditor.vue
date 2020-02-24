<template>
  <div class="material-editor-container m-fullscreen">
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
      <div v-if="!loading" class="menu-right">
        <v-btn icon @click="restoreMaterial(material._id.$oid)">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <v-btn icon @click="saveMaterial()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
        <v-btn icon @click="dialog_delete = true">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
      <div v-else>
        <v-progress-circular :width="3" :size="20" indeterminate color="green"></v-progress-circular>
      </div>
    </div>

    <!-- Material Content -->
    <div class="material-editor-content m-fullscreen-content">
      <!-- Overview -->
      <div class="category">
        <div class="category-menu">
          <span>Resumen</span>
        </div>
        <div class="category-bullet">
          <v-textarea
            class="category-text"
            v-model="material.overview"
            :rows="1"
            autoGrow
            dense
            hide-details
          ></v-textarea>
        </div>
      </div>
      <!-- Explanation -->
      <div class="category">
        <div class="category-menu">
          <span>Explicación</span>
        </div>
        <div class="category-bullet">
          <v-textarea
            class="category-text"
            v-model="material.explanation"
            :rows="1"
            autoGrow
            dense
            hide-details
          ></v-textarea>
        </div>
      </div>
      <!-- Bullets -->
      <div class="category">
        <div class="category-menu">
          <span>Puntos Importantes</span>
          <v-btn icon @click="addBullet(material.bullets)">
            <v-icon>mdi-plus</v-icon>
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
          <v-btn icon @click="removeBullet(material.bullets, b_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- Hyperlinks -->
      <div class="category">
        <div class="category-menu">
          <span>Enlaces</span>
          <v-btn icon @click="addHyperlink(material.hyperlinks)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="category-bullet" v-for="(hyperlink, h_idx) in material.hyperlinks" :key="h_idx">
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
          <v-btn icon @click="removeHyperlink(material.hyperlinks, h_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- Examples -->
      <div class="category">
        <div class="category-menu">
          <span>Ejemplos</span>
          <v-btn icon @click="addExample(material.examples)">
            <v-icon>mdi-plus</v-icon>
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
          <v-btn icon @click="removeExample(material.examples, e_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- Exercises -->
      <div class="category">
        <div class="category-menu">
          <span>Ejercicios</span>
          <v-btn icon @click="addExercise(material.exercises)">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
        <div class="category-bullet" v-for="(exercise, e_idx) in material.exercises" :key="e_idx">
          <div class="category-bullet-content">
            <v-textarea
              class="category-text mt-1 mb-2"
              v-model="exercise.question"
              :rows="1"
              autoGrow
              dense
              hide-details
            ></v-textarea>
            <v-radio-group v-model="exercise.correct">
              <div
                class="category-bullet"
                v-for="(alternative, a_idx) in exercise.alternatives"
                :key="a_idx"
              >
                <v-textarea
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
            <v-btn icon @click="addAlternative(material.exercises, e_idx)">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-btn icon @click="removeExercise(material.exercises, e_idx)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <!-- Movies -->
      <div class="category">
        <div class="category-menu">
          <span>Videos</span>
          <v-btn icon @click="addMovie(material.movies)">
            <v-icon>mdi-plus</v-icon>
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
          <v-btn icon @click="removeMovie(material.movies, m_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <!-- Images -->
      <div class="category">
        <div class="category-menu">
          <span>Imágenes</span>
          <v-btn icon @click="addImage(material.images)">
            <v-icon>mdi-plus</v-icon>
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
          <v-btn icon @click="removeImage(material.images, i_idx)">
            <v-icon>mdi-minus</v-icon>
          </v-btn>
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
import { updateMaterial } from "@/services/materialService";

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
    dialog_delete: false
  }),
  methods: {
    loadMaterials() {
      this.unselectMaterial();
      this.restoreMaterials();
    },
    async saveMaterial() {
      this.loading = true;
      this.material.id = this.material._id.$oid;
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
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.material-editor-container {
  .material-editor-content {
    padding: 8px 16px 60px 16px;

    .category {
      padding: 0 5px 0 12px;
      margin-bottom: 12px;
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