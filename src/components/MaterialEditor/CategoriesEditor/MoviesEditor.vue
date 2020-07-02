<template>
  <div id="editor-movies"></div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Embed from "@editorjs/embed";

export default {
  props: ["data"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.editor = new EditorJS({
      holderId: "editor-movies",
      tools: {
        header: Header,
        embed: Embed
      },
      data: JSON.parse(this.data)
    });
  },
  methods: {
    async save() {
      let outputData = await this.editor.save();
      let data = JSON.stringify(outputData);
      return data;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.editor {
  border-radius: 10px;
  @include box-shadow;
  .editor-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>