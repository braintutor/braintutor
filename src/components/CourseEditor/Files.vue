<template>
  <Files
    :document_type="'course'"
    :document_id="document_id"
  />
</template>

<script>
import Files from "@/components/globals/File/Files";
export default {
  data: () => ({
    document_id: "",
  }),
  created() {
    this.document_id = this.$router.currentRoute.params["course_id"];
  },
  components: {
    Files,
  },
};
</script>

<style>
</style>