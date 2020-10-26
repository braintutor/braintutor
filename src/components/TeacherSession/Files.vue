<template>
  <div class="m-container">
    <Files document_type="session" :document_id="session_id" />
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";
export default {
  data: () => ({
    session_id: "",
  }),
  created() {
    this.session_id = this.$route.params["session_id"];
  },
  components: {
    Files,
  },
};
</script>

<style>
</style>