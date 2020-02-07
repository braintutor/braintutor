<template>
  <div class="resource-container">
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
  props: ["resource_selected"],
  methods: {
    unselectResource() {
      this.$store.commit("setResourceSelected", null);
    }
  }
};
</script>

<style lang='scss' scoped>
.resource-container {
  .resource-content {
  }
}
</style>