<template>
  <div class="navigator-container">
    <div class="navigator-actions elevation-3">
      <div v-for="(action, a_idx) in actions" :key="a_idx">
        <span v-if="action.type === 'text'" class="navigator-action">{{action.value}}</span>
        <v-btn v-if="action.type === 'icon'" icon @click="action.callback">
          <v-icon>{{action.value}}</v-icon>
        </v-btn>
      </div>
      <!-- <v-btn class="navigator-action" icon @click="changeCategory(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <span class="navigator-action">{{`${category_idx + 1}/${categories.length}`}}</span>
      <v-btn class="navigator-action" icon @click="changeCategory(1)">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>-->
    </div>
  </div>
</template>

<script>
export default {
  props: ["actions"],
  mounted() {
    console.log(this.actions);
    
  }
};
</script>

<style lang='scss' scoped>
.navigator-container {
  width: 100%;
  pointer-events: none;
  .navigator-actions {
    width: max-content;
    padding: 8px 6px;
    margin: 0 auto;
    background: #fff;
    border-radius: 10px;
    opacity: 0.5;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    pointer-events: all;
    &:hover {
      cursor: pointer;
      opacity: 1;
    }
    .navigator-action {
      margin: 0 8px;
      font-weight: bold;
      font-size: 1.3rem;
      // font-size: 18px;
    }
  }
}
</style>