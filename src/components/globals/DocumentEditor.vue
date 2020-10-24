<template>
  <div>
    <div v-if="!hideControls" class="menu">
      <v-btn @click="submit" small rounded outlined text>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>

    <div :id="id"></div>

    <Files
      v-if="document_type && document_id"
      @file="onFileSelected"
      :document_type="document_type"
      :document_id="document_id"
    />
  </div>
</template>

<script>
import Files from "@/components/globals/File/Files";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
// import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import Table from "@editorjs/table";

import { convertToHMTL } from "@/services/editor";

class MImage {
  constructor({ data }) {
    this.data = data;
  }
  static get toolbox() {
    return {
      title: "Image",
      icon:
        '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }
  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("m-editor-img");

    if (this.data && this.data.url) {
      this._createImage(this.data.url, this.data.caption);
      return this.wrapper;
    }

    const input = document.createElement("input");
    input.setAttribute("id", "document-img");
    input.className = "m-editor-img-input";
    input.placeholder = "Paste an image URL...";

    input.addEventListener("paste", (event) => {
      this._createImage(event.clipboardData.getData("text"));
    });

    this.wrapper.appendChild(input);
    return this.wrapper;
  }
  save(blockContent) {
    const image = blockContent.querySelector("img");
    const caption = blockContent.querySelector("input");

    return {
      url: image.src,
      caption: caption.value,
    };
  }
  _createImage(url, captionText) {
    const image = document.createElement("img");
    const caption = document.createElement("input");

    image.src = url;
    caption.placeholder = "Caption...";
    caption.value = captionText || "";

    // this.wrapper.innerHTML = "";
    this.wrapper.appendChild(image);
    this.wrapper.appendChild(caption);
  }
}

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
          image: MImage,
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
      console.log(data);
      this.$emit("submit", data);
    },
    onFileSelected(file) {
      let el = document.getElementById("document-img");
      el.value = file.url;
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