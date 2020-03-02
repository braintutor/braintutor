<template>
  <!-- Material List -->
  <v-container v-if="!material" fluid>
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
          :image="'https://besthqwallpapers.com/img/original/47929/4k-android-green-and-yellow-google-chrome-material-design.jpg'"
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
  props: ["showServices"],
  data: () => ({
    material: null,
    categories: [],
    category_idx: 0
  }),
  computed: {
    materials() {
      return this.$store.state.materials;
    }
  },
  methods: {
    selectMaterial(material, categories) {
      this.material = material;
      this.categories = categories || [
        "overview",
        "explanation",
        "bullets",
        "examples",
        "images",
        "movies",
        "exercises",
        "faq",
        "hyperlinks"
      ];
      this.category_idx = 0;
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
</style>