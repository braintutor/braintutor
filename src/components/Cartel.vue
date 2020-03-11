<template>
  <div class="cartel-container transform-scale elevation-3" @click="callback()">
    <div class="cartel-img">
      <img :src="image" />
      <div class="cartel-actions">
        <v-btn
          v-for="(action, a_idx) in actions"
          :key="a_idx"
          class="cartel-action"
          fab
          small
          @click="action.callback"
        >
          <v-icon>{{action.icon}}</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="cartel-content m-fullcenter">
      <div v-if="title" class="cartel-title">{{title}}</div>
      <div v-if="description" class="cartel-description">{{description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "description", "image", "callback", "actions"]
};
</script>

<style lang='scss' scoped>
.cartel-container {
  height: 100%;
  border-radius: 10px;
  background: #fff;
  //
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
    .cartel-img {
      img {
        opacity: 1;
      }
    }
  }
  .cartel-img {
    position: relative;
    height: 130px;
    img {
      border-radius: 10px 10px 0 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
    }
    .cartel-actions {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      //
      display: flex;
      justify-content: center;
      align-items: center;
      .cartel-action {
        margin: 0 4px;
      }
    }
  }
  .cartel-content {
    padding: 8px 12px;
    text-align: center;
    .cartel-title {
      padding: 3px 0;
      font-size: 1rem;
      font-weight: bold;
    }
    .cartel-description {
      padding: 1px 0;
      font-size: .9rem;
      font-weight: normal;
    }
  }
}
</style>