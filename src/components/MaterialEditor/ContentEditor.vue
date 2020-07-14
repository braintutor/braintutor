<template>
  <div>
    <!-- Menu -->
    <div class="menu">
      <v-btn
        @click="adaptive = false"
        :outlined="adaptive"
        color="primary"
        rounded
        depressed
        x-small
      >Por Defecto</v-btn>
      <v-btn
        @click="adaptive = true"
        :outlined="!adaptive"
        class="ml-2"
        color="primary"
        rounded
        depressed
        x-small
      >Adaptativo</v-btn>
    </div>

    <CategoriesEditor v-if="adaptive" :material="material" />
    <DocumentsEditor v-else :material="material" />
  </div>
</template>

<script>
import CategoriesEditor from "./CategoriesEditor/index";
import DocumentsEditor from "./DocumentsEditor/index";

export default {
  props: ["material"],
  data: () => ({
    adaptive: false
  }),
  components: {
    CategoriesEditor,
    DocumentsEditor
  }
};
</script>

<style lang='scss' scoped>
.menu {
  padding: 6px 0;
  display: flex;
  justify-content: center;
}
</style>