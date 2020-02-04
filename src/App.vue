<template>
  <v-app>
    <Header />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",
  data: () => ({
    //
  }),
  components: {
    Header
  }
};
</script>

<style lang="scss">
/*Scrollbar*/
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-thumb {
  background: rgb(224, 223, 223);
}
::-webkit-scrollbar-thumb:hover {
  background: rgb(206, 206, 206);
}
</style>
