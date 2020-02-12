<template>
  <div class="cartel-container transform-scale elevation-3" @click="callback()">
    <img class="cartel-img" :src="image" />
    <div class="cartel-content m-fullcenter">
      <div v-if="title" class="cartel-title">{{title}}</div>
      <div v-if="description" class="cartel-description">{{description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "description", "image", "callback"]
};
</script>

<style lang='scss' scoped>
.cartel-container {
  height: 100%;
  font-size: 16px;
  border-radius: 10px;
  background: #fff;
  //
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
    .cartel-img {
      opacity: 1;
    }
  }
  .cartel-img {
    border-radius: 10px 10px 0 0;
    height: 130px;
    opacity: 0.8;
  }
  .cartel-content {
    padding: 12px 16px;
    text-align: center;
    .cartel-title {
      padding: 3px 0;
      font-size: calc(10px + 0.5vw);
      font-weight: bold;
    }
    .cartel-description {
      padding: 1px 0;
      font-size: calc(10px + 0.4vw);
      font-weight: normal;
    }
  }
}
</style>