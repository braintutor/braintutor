<template>
  <div>
    <CategoriesEditor v-if="course.adaptive" :material="material" />
    <DocumentsEditor v-else :material="material" />
  </div>
</template>

<script>
import CategoriesEditor from "./CategoriesEditor/index";
import DocumentsEditor from "./DocumentsEditor/index";

export default {
  props: ["material", "course"],
  components: {
    CategoriesEditor,
    DocumentsEditor
  }
};
</script>

<style lang='scss' scoped>
</style>