<template>
  <div>
    <DocumentEditor :data="material.documents[0]" hideControls readonly />
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

export default {
  props: {
    material: Object
  },
  components: {
    DocumentEditor
  }
};
</script>

<style lang='scss' scoped>
</style>