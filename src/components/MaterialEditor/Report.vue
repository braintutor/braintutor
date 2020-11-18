<template>
  <ReportEditor :material_id="material_id" />
</template>

<script>
import ReportEditor from "@/components/globals/Report/ReportEditor";

export default {
  data: () => ({
    material_id: "",
  }),
  created() {
    this.material_id = this.$route.params["material_id"];
  },
  components: {
    ReportEditor,
  },
};
</script>

<style>
</style>