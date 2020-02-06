<template>
  <!-- Resource List -->
  <v-container v-if="!resource_selected" fluid class="resources-container pa-2">
    <v-row no-gutters>
      <v-col cols="6" class="pa-2" v-for="(resource, r_idx) in resources" :key="r_idx">
        <div
          class="resource-cartel elevation-3"
          @click="selectResource(resource)"
        >{{resource.nombre}}</div>
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
</template>

<script>
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
    selectResource(resource) {
      this.$store.commit("setResourceSelected", resource);
    },
    unselectResource() {
      this.$store.commit("setResourceSelected", null);
    }
  }
};
</script>

<style lang='scss' scoped>
.resources-container {
  .resource-cartel {
    height: 100%;
    padding: 18px 20px;
    font-size: 16px;
    border-radius: 4px;
    text-align: center;
    border-top: 2px solid #1976d2;
    background: #fff;
    //
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .resource-cartel:hover {
    transition: all 200ms;
    transform: scale(1.03);
    cursor: pointer;
  }
}

.resource-container {
  .resource-content {
  }
}
</style>