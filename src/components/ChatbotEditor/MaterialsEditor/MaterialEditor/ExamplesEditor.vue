<template>
  <div id="editor-examples"></div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";

export default {
  props: ["data"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.editor = new EditorJS({
      holderId: "editor-examples",
      tools: {
        header: Header,
        list: List,
        image: SimpleImage,
        marker: Marker
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