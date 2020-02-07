<template>
  <div class="m-fullscreen">
    <!-- Resource List -->
    <v-container v-if="!resource_selected" fluid class="resources-container pa-2">
      <v-row no-gutters>
        <v-col
          cols="6"
          md="3"
          lg="2"
          class="pa-2"
          v-for="(resource, r_idx) in resources"
          :key="r_idx"
        >
          <Cartel :resource="resource" />
        </v-col>
      </v-row>
    </v-container>
    <!-- Resource Selected -->
    <div v-else class="resource-container">
      <v-toolbar dense flat>
        <v-btn icon @click="unselectResource()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{resource_selected.nombre}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-heart</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="resource-content"></div>
    </div>
  </div>
</template>

<script>
import Cartel from "./Cartel";

export default {
  data: () => ({}),
  computed: {
    resources() {
      return this.$store.state.resources;
    },
    resource_selected() {
      return this.$store.state.resource_selected;
    }
  },
  methods: {
    unselectResource() {
      this.$store.commit("setResourceSelected", null);
    }
  },
  components: {
    Cartel
  }
};
</script>

<style lang='scss' scoped>
.resources-container {
  overflow: auto;
}

.resource-container {
  .resource-content {
  }
}
</style>