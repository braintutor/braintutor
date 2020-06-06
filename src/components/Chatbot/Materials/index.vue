<template>
  <div class="m-fullscreen">
    <div class="menu">
      <!-- <div class="name">{{chatbot.name}}</div> -->
      <div></div>
      <div class="options">
        <span class="mr-2">Contenido Adaptado</span>
        <v-switch class="options__switch" v-model="adapt_content"></v-switch>
      </div>
    </div>
    <!-- Material List -->
    <v-container class="list m-fullscreen-content" v-if="!material" fluid>
      <v-row no-gutters>
        <v-col
          cols="6"
          md="3"
          lg="2"
          v-for="(material, r_idx) in materials"
          :key="r_idx"
          class="pa-2"
        >
          <Cartel
            :image="material.image"
            :description="material.name"
            :callback="() => selectMaterial(material)"
          />
        </v-col>
      </v-row>
      <p class="text-center mt-2" v-show="materials.length === 0">No hay material.</p>
    </v-container>
    <!-- Material Selected -->
    <Material
      v-else
      class="m-fullscreen-content"
      :material="material"
      :categories="categories"
      :category_idx="category_idx"
      :unselectMaterial="unselectMaterial"
      :changeCategory="direction => changeCategory(direction)"
    />
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import Material from "./Material/index";

import { getCategoriesByLearningStyle } from "@/services/studentService.js";
import { Clamp } from "@/services/math";

export default {
  props: ["chatbot", "showServices"],
  data: () => ({
    material: null,
    adapt_content: true,
    category_idx: 0,
    categories_to_show: [
      // "overview",
      "explanation",
      // "bullets",
      "images",
      "movies",
      "examples",
      "exercises",
      "faq",
      "hyperlinks"
    ],
    //
    categories_ls_original: {},
    categories_ls: {}
  }),
  async mounted() {
    this.categories_ls_original = await getCategoriesByLearningStyle();
    this.categories_ls = JSON.parse(
      JSON.stringify(this.categories_ls_original)
    );
  },
  computed: {
    materials() {
      return this.$store.state.materials;
    },
    categories() {
      let categories = Object.entries(this.categories_ls).reduce(
        (arr, [key, value]) => {
          if (
            (value.show || !this.adapt_content) &&
            this.categories_to_show.includes(key)
          ) {
            arr.push(key);
          }
          return arr;
        },
        []
      );
      categories.sort();
      categories.sort((a, b) => {
        return this.categories_ls[b].priority - this.categories_ls[a].priority;
      });
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
        this.showServices(false);
      }, 100);
    },
    unselectMaterial() {
      this.material = null;
      this.showServices(true);
    },
    changeCategory(direction) {
      this.category_idx = Clamp(
        this.category_idx + direction,
        0,
        this.categories.length - 1
      );
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
  padding: 2px 6px 70px 6px;
}
.options {
  padding: 0 10px;
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