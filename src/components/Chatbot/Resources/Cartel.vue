<template>
  <div class="cartel-container elevation-3" @click="selectResource(resource)">
    <img
      class="cartel-img"
      src="https://lh3.googleusercontent.com/proxy/UxHC3qd1RIASrgslHAYlrIEJ71l4Kl6M4ZFx4KADTc1zOzL1Ern_Xyr2DYhlT5lnEzXhho3YDd4MvVevKW9iJUiQdujhxN6IGipeucxZ9gmUys3Q9jr8itj0UXeRoPlXlw"
    />
    <div class="cartel-title">{{resource.nombre}}</div>
  </div>
</template>

<script>
export default {
  props: ["resource"],
  methods: {
    selectResource(resource) {
      console.log(resource);
      
      this.$store.commit("setResourceSelected", resource);
    }
  }
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
    transition: all 200ms;
    transform: scale(1.03);
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
    //
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
  }
}
</style>