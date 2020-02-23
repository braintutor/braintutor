<template>
  <div class="material-editor-container m-fullscreen">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="restoreMaterials()">
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
        <div class="category-content">
          <div class="category-bullet category-text">
            <v-textarea v-model="material.overview" :rows="1" autoGrow dense hide-details></v-textarea>
          </div>
        </div>
      </div>
      <!-- Explanation -->
      <div class="category">
        <div class="category-menu">
          <span>Explicación</span>
        </div>
        <div class="category-content">
          <div class="category-bullet category-text">
            <v-textarea v-model="material.explanation" :rows="1" autoGrow dense hide-details></v-textarea>
          </div>
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
        <div class="category-content">
          <div class="category-bullet" v-for="(bullet, b_idx) in material.bullets" :key="b_idx">
            <div class="category-text">
              <v-textarea v-model="material.bullets[b_idx]" :rows="1" autoGrow dense hide-details></v-textarea>
            </div>
            <v-btn icon @click="removeBullet(material.bullets, b_idx)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </div>
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
        <div class="category-content">
          <div
            class="category-bullet"
            v-for="(hyperlink, h_idx) in material.hyperlinks"
            :key="h_idx"
          >
            <div class="category-bullet-content">
              <div class="category-bullet-item category-text">
                <span class="category-title">Nombre:</span>
                <v-text-field v-model="material.hyperlinks[h_idx].name" dense hide-details></v-text-field>
              </div>
              <div class="category-bullet-item category-text">
                <span class="category-title">Enlace:</span>
                <v-text-field v-model="material.hyperlinks[h_idx].link" dense hide-details></v-text-field>
              </div>
            </div>
            <v-btn icon @click="removeHyperlink(material.hyperlinks, h_idx)">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </div>
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
        <div class="category-content">
          <div class="category-bullet" v-for="(example, e_idx) in material.examples" :key="e_idx">
            <div class="category-text">
              <v-textarea v-model="material.examples[e_idx]" :rows="1" autoGrow dense hide-details></v-textarea>
            </div>
            <v-btn icon @click="removeExample(material.examples, e_idx)">
              <v-icon>mdi-minus</v-icon>
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
import { updateMaterial } from "@/services/materialService";

export default {
  props: ["material", "restoreMaterials", "deleteMaterial"],
  data: () => ({
    loading: false,
    dialog_delete: false
  }),
  methods: {
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
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.material-editor-container {
  .material-editor-content {
    padding: 8px 20px 50px 20px;

    .category {
      padding: 12px 20px 10px 20px;
      margin-bottom: 20px;
      border-radius: 10px;
      @include box-shadow;
      .category-menu {
        font-size: .9rem;
        color: #afafaf;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .category-content {
        margin-top: -14px;
        padding-bottom: 10px;
        .category-text {
          width: 100%;
          & * {
            margin: 0;
            font-size: 1rem !important;
          }
        }
        .category-title {
          font-weight: bold;
        }
        .category-bullet {
          display: flex;
          padding-top: 22px;
          .category-bullet-content {
            width: 100%;
            .category-bullet-item {
              padding-bottom: 14px;
            }
          }
        }
      }
    }
  }
}

.menu {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .menu-title {
    margin: 0 12px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .menu-left {
    display: flex;
  }
  .menu-right {
  }
}
</style>