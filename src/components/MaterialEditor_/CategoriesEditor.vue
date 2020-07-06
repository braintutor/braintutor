<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
    <!-- <p>{{material}}</p> -->
    <!-- Categories -->
    <div v-show="!category" class="container">
      <div class="row no-gutters">
        <!-- Category -->
        <div
          v-for="([category, value], idx) in Object.entries(categories)"
          :key="idx"
          class="col-6 col-sm-3 px-1"
        >
          <section class="category" @click="selectCategory(category)">
            <img
              class="category__image"
              src="https://www.iconarchive.com/download/i94273/bokehlicia/captiva/accessories-text-editor.ico"
              alt
            />
            <span class="category__name">{{value.name}}</span>
          </section>
        </div>
      </div>
    </div>

    <!-- CategoryEditor -->
    <section v-if="category" class="editor">
      <div class="editor__menu">
        <v-btn @click="category = null" icon small>
          <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="editor__title">{{categories[category].name}}</span>
      </div>
      <!-- Exercises -->
      <QuizEditor v-if="category === 'exercises'" :data="material[category]" @submit="save" />
      <!-- Default -->
      <TextEditor v-else class="m-card" :data="material[category]" @submit="save" />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import TextEditor from "@/components/globals/TextEditor";
import QuizEditor from "@/components/globals/QuizEditor";

import { updateMaterialCategory } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    category: null,
    categories: {
      overview: {
        name: "Resumen"
      },
      explanation: {
        name: "Explicación"
      },
      hyperlinks: {
        name: "Enlaces"
      },
      examples: {
        name: "Ejemplos"
      },
      exercises: {
        name: "Ejercicios"
      },
      movies: {
        name: "Videos"
      },
      images: {
        name: "Imágenes"
      },
      faq: {
        name: "Preguntas Frecuentes"
      }
    },
    //
    loading: false,
    loading_msg: ""
  }),
  methods: {
    selectCategory(category) {
      this.category = category;
    },
    async save(data) {
      this.loading = true;
      this.loading_msg = "Guardando";

      let material_id = this.material._id.$oid;
      let category = this.category;

      try {
        await updateMaterialCategory(material_id, category, data);
        this.material[category] = data;
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    }
  },
  components: {
    loading,
    TextEditor,
    QuizEditor
  }
};
</script>

<style lang='scss' scoped>
.category {
  padding: 10px;
  border-radius: 20px;
  text-align: center;
  transition: 0.5s;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
      0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
  }

  &__image {
    // width: 100%;
    max-width: 50%;
  }
  &__name {
    margin-top: 6px;
    font-weight: bold;
  }
}

.editor {
  &__menu {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }
  &__title {
    margin-top: 1px;
    margin-left: 10px;
    font-size: 1.1rem;
    font-weight: bold;
  }
}
</style>