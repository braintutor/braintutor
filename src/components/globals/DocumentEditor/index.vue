<template>
  <div>
    <div v-if="!hideControls" class="menu">
      <v-btn @click="submit" small rounded outlined text>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>

    <div :id="id"></div>

    <v-dialog
      v-model="showFiles"
      v-if="document_type && document_id"
      width="1000"
    >
      <Files
        @file="onFileSelected"
        :document_type="document_type"
        :document_id="document_id"
        :filters="['image']"
        class="m-card"
        style="height: 75vh"
      />
    </v-dialog>
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
// import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

import Image from "./Image";
import Embed from "./Embed";

import { convertToHMTL } from "@/services/editor";

export default {
  props: {
    id: {
      type: String,
      default: "editor",
    },
    data: {
      type: [String, Object],
    },
    hideControls: Boolean,
    readonly: Boolean,
    // Files
    document_type: String,
    document_id: String,
  },
  data: () => ({
    editor: null,
    showFiles: false,
    input_id: null,
  }),
  mounted() {
    this.init();
    window.showFiles = (input_id) => {
      this.showFiles = true;
      this.input_id = input_id;
    };
  },
  methods: {
    init() {
      let data = {};
      try {
        data = JSON.parse(this.data);
      } catch (error) {
        //
      }
      if (this.readonly) {
        let html = convertToHMTL(data.blocks || []);
        document.getElementById(this.id).innerHTML = html;
        return;
      }
      this.editor = new EditorJS({
        holderId: this.id,
        tools: {
          header: Header,
          list: List,
          // image: SimpleImage,
          image: Image,
          marker: Marker,
          embed: Embed,
          delimiter: Delimiter,
          table: {
            class: Table,
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: `${process.env.VUE_APP_API_URL}/getLinkPreview`,
            },
          },
        },
        data,
        // onReady: () => {
        //   if (this.readonly) {
        //     let editable_elements = document.querySelectorAll(
        //       "[contenteditable=true]"
        //     );
        //     editable_elements.forEach((el) =>
        //       el.removeAttribute("contenteditable")
        //     );
        //     let icon_settings = document.querySelectorAll(".ce-toolbar");
        //     icon_settings.forEach((el) => el.remove());

        //     let box = document.querySelectorAll(".codex-editor__redactor");
        //     box.forEach((el) => {
        //       el.style.paddingBottom = "0px !important";
        //     });
        //   }
        // },
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
    },
    onFileSelected(file) {
      let input = document.getElementById(this.input_id);
      if (input) {
        input.value = file.url;
        input.click();
      }
      this.showFiles = false;
    },
    clear() {
      this.editor.clear();
    },
  },
  components: {
    Files,
  },
};
</script>

<style lang='scss'>
.menu {
  padding: 0;
  margin-bottom: 8px;
  display: flex;
  justify-content: flex-end;
}
</style>