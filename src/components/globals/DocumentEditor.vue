<template>
  <div class="pa-2">
    <div class="menu">
      <v-btn @click="submit" small rounded text>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>

    <div id="editor"></div>
  </div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";

export default {
  props: ["data"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.create();
  },
  methods: {
    create() {
      let data = {};
      try {
        data = JSON.parse(this.data);
      } catch (error) {
        //
      }
      this.editor = new EditorJS({
        holderId: "editor",
        tools: {
          header: Header,
          list: List,
          image: SimpleImage,
          marker: Marker,
          embed: Embed,
          linkTool: {
            class: LinkTool,
            config: {
              // endpoint: "http://localhost:5000/getLinkPreview"
              endpoint:
                "https://braintutor-service-v2.herokuapp.com/getLinkPreview"
            }
          }
        },
        data
      });
    },
    async submit() {
      let outputData = await this.editor.save();
      let data = JSON.stringify(outputData);
      this.$emit("submit", data);
    }
  }
};
</script>

<style lang='scss' scoped>
.menu {
  padding: 0;
  display: flex;
  justify-content: flex-end;
}
</style>