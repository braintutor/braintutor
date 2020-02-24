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
.menu {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .menu-title {
    margin: 0 10px !important;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .menu-left {
    flex-grow: 1;
    display: flex;
  }
  .menu-right {
    display: flex;
  }
}
</style>
