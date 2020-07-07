<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
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
            <img class="category__image" :src="value.image" alt />
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
      <!-- Overview -->
      <TextEditor v-if="category === 'overview'" :text="material[category]" @submit="save" />
      <!-- Exercises -->
      <QuizEditor v-else-if="category === 'exercises'" :quiz="material[category]" @submit="save" />
      <!-- FAQ -->
      <FAQEditor v-else-if="category === 'faq'" :faq="material[category]" @submit="save" />
      <!-- Default -->
      <DocumentEditor v-else class="m-card" :data="material[category]" @submit="save" />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import TextEditor from "./TextEditor";
import QuizEditor from "@/components/globals/QuizEditor";
import FAQEditor from "./FAQEditor";
import DocumentEditor from "@/components/globals/DocumentEditor";

import { updateMaterialCategory } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    category: null,
    categories: {
      overview: {
        name: "Resumen",
        image: require("@/assets/material/overview.png")
      },
      explanation: {
        name: "Explicación",
        image: require("@/assets/material/explanation.png")
      },
      movies: {
        name: "Videos",
        image: require("@/assets/material/movies.png")
      },
      images: {
        name: "Imágenes",
        image: require("@/assets/material/images.png")
      },
      examples: {
        name: "Ejemplos",
        image: require("@/assets/material/examples.png")
      },
      exercises: {
        name: "Ejercicios",
        image: require("@/assets/material/exercises.png")
      },
      faq: {
        name: "Preguntas Frecuentes",
        image: require("@/assets/material/faq.png")
      },
      hyperlinks: {
        name: "Enlaces",
        image: require("@/assets/material/hyperlinks.png")
      }
      // https://iconos8.es/icons
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
        if ((data.length * 2) / 1000 > 500)
          throw { msg: "Ha sobrepasado el exceso de tamaño." };
        await updateMaterialCategory(material_id, category, data);
        this.material[category] = data;
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    }
  },
  components: {
    loading,
    TextEditor,
    QuizEditor,
    FAQEditor,
    DocumentEditor
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