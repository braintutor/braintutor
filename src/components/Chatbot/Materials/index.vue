<template>
  <!-- Material List -->
  <v-container class="list" v-if="!material" fluid>
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
    :material="material"
    :categories="categories"
    :category_idx="category_idx"
    :unselectMaterial="unselectMaterial"
    :changeCategory="direction => changeCategory(direction)"
  />
</template>

<script>
import Cartel from "@/components/Cartel";
import Material from "./Material/index";

import { Clamp } from "@/services/math";

export default {
  props: ["showServices", "categories_ls"],
  data: () => ({
    material: null,
    category_idx: 0
  }),
  computed: {
    materials() {
      return this.$store.state.materials;
    },
    categories() {
      let categories = Object.entries(this.categories_ls).reduce(
        (arr, [key, value]) => {
          if (value) {
            arr.push(key);
          }
          return arr;
        },
        []
      );
      return categories;
    }
  },
  methods: {
    selectMaterial(material, category) {
      this.material = material;
      if (category) this.category_idx = this.categories.indexOf(category);
      else this.category_idx = 0;
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
</style>