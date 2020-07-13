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

    <CategoriesEditor v-if="adaptive" />
    <DocumentsEditor v-else />
  </div>
</template>

<script>
import CategoriesEditor from "./CategoriesEditor/index";
import DocumentsEditor from "./DocumentsEditor/index";

export default {
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
  display: flex;
  justify-content: flex-end;
}
</style>