<template>
  <!-- Resource List -->
  <v-container v-if="!resource" fluid class="pa-3">
    <v-row no-gutters>
      <v-col
        cols="6"
        md="3"
        lg="2"
        class="pa-2"
        v-for="(resource, r_idx) in resources"
        :key="r_idx"
      >
        <Cartel
          :description="resource.nombre"
          :image="'https://besthqwallpapers.com/img/original/47929/4k-android-green-and-yellow-google-chrome-material-design.jpg'"
          :callback="() => selectResource(resource)"
        />
      </v-col>
    </v-row>
  </v-container>
  <!-- Resource Selected -->
  <Resource
    v-else
    :resource="resource"
    :items="items"
    :item_idx="item_idx"
    :unselectResource="unselectResource"
    :changeItem="direction => changeItem(direction)"
  />
</template>

<script>
import Cartel from "@/components/Cartel";
import Resource from "./Resource/index";

import { Clamp } from "@/services/math";

export default {
  props: ["showServices"],
  data: () => ({
    resource: null,
    items: [],
    item_idx: 0
  }),
  computed: {
    resources() {
      return this.$store.state.resources;
    }
  },
  methods: {
    selectResource(resource, items) {
      this.resource = resource;
      this.items = items || [
        "texto",
        "video",
        "documento",
        "imagen",
        "quiz",
        "ejemplos",
        "importancia",
        "explicacion",
        "faq"
      ];
      this.item_idx = 0;
      this.showServices(false);
    },
    unselectResource() {
      this.resource = null;
      this.showServices(true);
    },
    changeItem(direction) {
      this.item_idx = Clamp(
        this.item_idx + direction,
        0,
        this.items.length - 1
      );
    }
  },
  components: {
    Cartel,
    Resource
  }
};
</script>

<style lang='scss' scoped>
</style>