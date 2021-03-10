<template>
  <div>
    <!-- Categories -->
    <v-container v-show="!category">
      <v-row no-gutters>
        <!-- Category -->
        <v-col
          cols="6"
          sm="3"
          v-for="([category, value], idx) in Object.entries(categories)"
          :key="idx"
        >
          <section class="category" @click="selectCategory(category)">
            <img class="category__image" :src="value.image" alt />
            <span class="category__name">{{ value.name }}</span>
          </section>
        </v-col>
      </v-row>
    </v-container>
    <!-- CategoryEditor -->
    <section v-if="category" class="editor">
      <div class="editor__menu">
        <v-btn @click="category = null" icon small>
          <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
        </v-btn>
        <span class="editor__title">{{ categories[category].name }}</span>
      </div>
      <!-- Overview -->
      <!-- <TextEditor
        v-if="category === 'overview'"
        :text="material.data_fs[category]"
        :maxlength="false"
        @submit="save"
      /> -->
      <DocumentEditor
        v-if="category === 'overview'"
        :data="material.data_fs[category]"
        @submit="save"
        :document_type="'course'"
        :document_id="material.course_id.$oid"
      />
      <!-- Exercises -->
      <QuizEditor
        v-else-if="category === 'exercises'"
        :quiz="material.data_fs[category]"
        :maxlength="100"
        document_type="course"
        :document_id="material.course_id.$oid"
        @submit="save"
      />
      <!-- FAQ -->
      <FAQEditor
        v-else-if="category === 'faq'"
        :faq="material.data_fs[category]"
        :maxlength="100"
        @submit="save"
      />
      <!-- Default -->
      <DocumentEditor
        v-else
        :data="material.data_fs[category]"
        @submit="save"
        :document_type="'course'"
        :document_id="material.course_id.$oid"
      />
    </section>
  </div>
</template>

<script>
// import TextEditor from "./TextEditor";
import QuizEditor from "@/components/globals/QuizEditor";
import FAQEditor from "./FAQEditor";
import DocumentEditor from "@/components/globals/DocumentEditor/index";
import { updateMaterialCategory } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    data: {},
    category: null,
    categories: {
      overview: {
        name: "Resumen",
        image: require("@/assets/material/overview.png"),
      },
      explanation: {
        name: "Explicación",
        image: require("@/assets/material/explanation.png"),
      },
      movies: {
        name: "Videos",
        image: require("@/assets/material/movies.png"),
      },
      images: {
        name: "Imágenes",
        image: require("@/assets/material/images.png"),
      },
      examples: {
        name: "Ejemplos",
        image: require("@/assets/material/examples.png"),
      },
      exercises: {
        name: "Ejercicios",
        image: require("@/assets/material/exercises.png"),
      },
      faq: {
        name: "Preguntas Frecuentes",
        image: require("@/assets/material/faq.png"),
      },
      hyperlinks: {
        name: "Enlaces",
        image: require("@/assets/material/hyperlinks.png"),
      },
      // https://iconos8.es/icons
    },
  }),
  methods: {
    selectCategory(category) {
      this.category = category;
    },
    async save(data) {
      this.showLoading("Guardando");
      let material_id = this.material._id.$oid;
      let category = this.category;
      try {
        await updateMaterialCategory(material_id, category, data);
        this.material.data_fs[category] = data;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    // TextEditor,
    QuizEditor,
    FAQEditor,
    DocumentEditor,
  },
};
</script>

<style lang='scss' scoped>
.category {
  margin: 8px;
  padding: 16px;
  text-align: center;
  transition: 0.5s;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    background: #e4eeff;
    transform: translateY(-10px);
    // box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    //   0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
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
  padding-bottom: 120px;
  &__menu {
    margin-bottom: 10px;
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