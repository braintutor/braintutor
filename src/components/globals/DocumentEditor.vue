<template>
  <div>
    <div v-if="!hideControls" class="menu">
      <v-btn @click="submit" small rounded text>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>

    <div :id="id" class="m-card py-3"></div>
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
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

export default {
  props: {
    id: {
      type: String,
      default: "editor"
    },
    data: {
      type: [String, Object]
    },
    hideControls: Boolean
  },
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
        holderId: this.id,
        tools: {
          header: Header,
          list: List,
          image: SimpleImage,
          marker: Marker,
          embed: Embed,
          delimiter: Delimiter,
          table: {
            class: Table
          },
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
    async getData() {
      let outputData = await this.editor.save();
      let data = JSON.stringify(outputData);
      return data;
    },
    async submit() {
      let data = await this.getData();
      this.$emit("submit", data);
    }
  }
};
</script>

<style lang='scss' scoped>
.menu {
  padding: 0;
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>