<template>
  <div class="pa-2">
    <div id="text-editor"></div>
  </div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";

export default {
  props: ["data"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.read();
  },
  methods: {
    read() {
      let data = {};
      try {
        data = JSON.parse(this.data);
      } catch (error) {
        //
      }
      this.editor = new EditorJS({
        holderId: "text-editor",
        tools: {
          header: Header,
          list: List,
          image: SimpleImage,
          marker: Marker,
          embed: Embed
        },
        data
      });
    },
    async getData() {
      let outputData = await this.editor.save();
      let data = JSON.stringify(outputData);
      return data;
    }
  }
};
</script>

<style lang='scss' scoped>
</style>