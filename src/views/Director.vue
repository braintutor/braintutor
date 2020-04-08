<template>
  <AppSidebar :links="links">
    <Classrooms :slot="0" />
  </AppSidebar>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import Classrooms from "@/components/Director/Classrooms/index";

export default {
  data: () => ({
    links: []
  }),
  mounted() {
    this.links = [
      {
        image:
          "https://rjwgas.com.au/wp-content/uploads/2015/08/gas-is-economical.png",
        text: "Dashboard"
      }
    ];
  },
  components: {
    AppSidebar,
    Classrooms
  }
};
</script>

<style>
</style>