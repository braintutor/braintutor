<template>
  <div class="cartel-container elevation-3" @click="selectResource(resource)">
    <img
      class="cartel-img"
      src="https://odisea.es/wp-content/themes/html5blank-stable6-4-16/img/imagenotfound.png"
    />
    <div class="cartel-title">{{resource.nombre}}</div>
  </div>
</template>

<script>
export default {
  props: ["resource"],
  methods: {
    selectResource(resource) {
      this.$store.commit("setResourceSelected", resource);
    }
  }
};
</script>

<style lang='scss' scoped>
.cartel-container {
  height: 100%;
  font-size: 16px;
  border-radius: 4px;
  background: #fff;
  //
  display: flex;
  flex-direction: column;

  &:hover {
    transition: all 200ms;
    transform: scale(1.03);
    cursor: pointer;
  }
  .cartel-img {
    height: 120px;
  }
  .cartel-title {
    margin: 0;
    padding: 12px 16px;
    text-align: center;
    word-wrap: break-word;
    //
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
  }
}
</style>