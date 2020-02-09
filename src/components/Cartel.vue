<template>
  <div class="cartel-container transform-scale elevation-3" @click="callback()">
    <img class="cartel-img" src="@/assets/backgrounds/green.jpg" />
    <div class="cartel-title m-fullcenter">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: ["title", "image", "callback"]
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
  .cartel-title {
    margin: 0;
    padding: 12px 16px;
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    word-wrap: break-word;
  }
}
</style>