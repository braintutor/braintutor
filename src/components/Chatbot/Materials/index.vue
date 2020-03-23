<template>
  <div class="m-fullscreen">
    <div class="options">
      <span class="mr-2">Contenido Adaptado</span>
      <v-switch class="options__switch" v-model="adapt_content"></v-switch>
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
            :description="material.name"
            :image="'https://cdn.dribbble.com/users/1742866/screenshots/3966741/38-material-design.jpg'"
            :callback="() => selectMaterial(material)"
          />
        </v-col>
      </v-row>
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
  props: ["showServices"],
  data: () => ({
    material: null,
    adapt_content: true,
    category_idx: 0,
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
          if (value.show || !this.adapt_content) {
            arr.push(key);
          }
          return arr;
        },
        []
      );
      categories.sort();
      categories.sort((a, b) => {
        return this.categories_ls[a].priority - this.categories_ls[b].priority;
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
      this.material = material;

      if (category) {
        this.categories_ls[category].show = true;
        this.category_idx = this.categories.indexOf(category);
      } else this.category_idx = 0;
      this.showServices(false);
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
.list {
  padding-bottom: 70px;
}
.options {
  padding: 0 20px;
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