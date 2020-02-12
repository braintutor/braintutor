<template>
  <div class="evaluation-container m-fullscreen">
    <div class="evaluation-menu">
      <v-btn icon @click="unselectEvaluation()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="evaluation-title">{{evaluation_selected.nombre}}</span>
    </div>
    <div class="m-fullscreen-content">
      <div class="evaluation-content"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["evaluation_selected", "unselectEvaluation"],
  data: () => ({}),
  methods: {
    // unselectEvaluation() {
    //   this.evaluation_selected = null;
    // }
  }
};
</script>

<style lang='scss' scoped>
.evaluation-container {
  position: relative;

  .evaluation-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    .evaluation-title {
      margin: 0 12px;
      font-size: calc(9.5px + 1vw);
      font-weight: bold;
    }
  }
  .evaluation-content {
    height: 100%;
    padding: 20px;
    padding-top: 5px;
  }
}
</style>