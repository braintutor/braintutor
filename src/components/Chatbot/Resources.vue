<template>
  <v-container fluid class="resources-container pa-2">
    <v-row no-gutters>
      <v-col cols="6" class="pa-2" v-for="(resource, r_idx) in resources" :key="r_idx">
        <div class="resource-cartel elevation-3">{{resource.nombre}}</div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
  computed: {
    resources() {
      return this.$store.state.resources;
    }
  }
};
</script>

<style lang='scss' scoped>
.resources-container {
  border-left: 1px solid #eee;

  .resource-cartel {
    height: 100%;
    padding: 18px 20px;
    font-size: 16px;
    border-radius: 4px;
    text-align: center;
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
</style>