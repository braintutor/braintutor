<template>
  <div class="m-fullscreen">
    <!-- Resource List -->
    <v-container v-if="!resource_selected" fluid class="resources-container pa-3">
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
    <Resource v-else :resource_selected="resource_selected"></Resource>
  </div>
</template>

<script>
import Cartel from "./Cartel";
import Resource from "./Resource";

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
  methods: {},
  components: {
    Cartel,
    Resource
  }
};
</script>

<style lang='scss' scoped>
.resources-container {
  overflow: auto;
}
</style>