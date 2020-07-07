<template>
  <section class="editor">
    <div class="editor__menu">
      <v-btn @click="$emit('submit', data)" text small rounded>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>

    <v-textarea class="editor__text" v-model="data" rows="3" solo auto-grow></v-textarea>
  </section>
</template>

<script>
export default {
  props: ["text"],
  data: () => ({
    data: ""
  }),
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.text));
  }
};
</script>

<style lang='scss' scoped>
.editor {
  &__menu {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
  &__text {
    border-radius: 10px;
  }
}
</style>