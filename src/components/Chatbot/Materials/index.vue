<template>
  <div class="m-fullscreen">
    <div class="menu">
      <!-- <div class="name">{{chatbot.name}}</div> -->
      <div></div>
      <!-- <div class="options">
        <span class="mr-2">Contenido Adaptado</span>
        <v-switch class="options__switch" v-model="adapt_content"></v-switch>
      </div>-->
    </div>
    <!-- Material List -->
    <div v-if="!material">
      <v-container class="list m-fullscreen-content" fluid>
        <!-- Sequential -->
        <v-row v-if="categories_ls_original['understanding'] === 'global' && false" no-gutters>
          <v-col
            cols="6"
            md="3"
            lg="2"
            v-for="(material, r_idx) in materials"
            :key="r_idx"
            class="pa-2"
          >
            <Cartel
              style="height: 100%"
              :image="material.image"
              :description="material.name"
              :callback="() => selectMaterial(material)"
            />
          </v-col>
        </v-row>
        <!-- Global -->
        <div v-else class="ma-2">
          <div class="mb-3" v-for="(material, r_idx) in materials" :key="r_idx">
            <div class="m-cardx" @click="selectMaterial(material)">
              <div class="m-cardx__img">
                <img :src="material.image" />
              </div>
              <div class="m-cardx__body">
                <p class="m-cardx__title">{{material.name}}</p>
                <p class="m-cardx__description">{{material.description}}</p>
              </div>
            </div>
          </div>
        </div>
        <p class="text-center mt-2" v-show="materials.length === 0">No hay material.</p>
      </v-container>
    </div>
    <!-- Material Selected -->
    <Material
      v-else
      class="m-fullscreen-content"
      :material="material"
      :adaptive="course.adaptive"
      :categories="categories"
      :category_idx="category_idx"
      :unselectMaterial="unselectMaterial"
      :setCategory="setCategory"
    />
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import Material from "./Material";

import { getCategoriesByLearningStyle } from "@/services/studentService.js";
import { Clamp } from "@/services/math";

export default {
  props: ["chatbot", "course"],
  data: () => ({
    material: null,
    adapt_content: true,
    category_idx: 0,
    categories_to_show: [
      // "overview",
      "explanation",
      "movies",
      "images",
      "examples",
      "exercises",
      "hyperlinks",
      "faq",
      "quizzes"
    ],
    //
    categories_ls_original: {},
    categories_ls: {}
  }),
  async created() {
    this.categories_ls_original = await getCategoriesByLearningStyle();
    this.categories_ls_original.quizzes = { show: true };
    this.categories_ls = JSON.parse(
      JSON.stringify(this.categories_ls_original)
    );
  },
  computed: {
    materials() {
      return this.$store.state.materials;
    },
    categories() {
      // let categories = Object.entries(this.categories_ls).reduce(
      //   (arr, [key, value]) => {
      //     if (
      //       (value.show || !this.adapt_content) &&
      //       this.categories_to_show.includes(key)
      //     ) {
      //       arr.push(key);
      //     }
      //     return arr;
      //   },
      //   []
      // );
      // categories.sort();
      // categories.sort((a, b) => {
      //   return this.categories_ls[b].priority - this.categories_ls[a].priority;
      // });
      let categories = this.categories_to_show.filter(
        category_to_show => (this.categories_ls[category_to_show] || {}).show
      );
      return categories;
    }
  },
  watch: {
    adapt_content() {
      this.category_idx = 0;
    }
  },
  methods: {
    selectMaterial(material, category) {
      this.categories_ls = JSON.parse(
        JSON.stringify(this.categories_ls_original)
      );
      this.material = null;
      setTimeout(() => {
        this.material = material;
        if (category) {
          this.categories_ls[category].show = true;
          this.category_idx = this.categories.indexOf(category);
        } else this.category_idx = 0;
      }, 100);
    },
    unselectMaterial() {
      this.material = null;
    },
    setCategory(idx) {
      this.category_idx = Clamp(idx, 0, this.categories.length - 1);
    }
  },
  components: {
    Cartel,
    Material
  }
};
</script>

<style lang='scss' scoped>
.menu {
  padding-bottom: 0;
  .name {
    margin-left: 8px;
    color: #8b8b8b;
    font-size: 1.2rem;
    font-weight: bold;
  }
}
.list {
  padding: 5px;
  padding-top: 0;
}
.options {
  padding: 0 8px;
  font-size: 0.85rem;
  color: rgb(92, 92, 92);
  //
  display: flex;
  align-items: center;
  justify-content: flex-end;
  &__switch {
    padding: 0 !important;
    margin: 0 !important;
  }
}
</style>