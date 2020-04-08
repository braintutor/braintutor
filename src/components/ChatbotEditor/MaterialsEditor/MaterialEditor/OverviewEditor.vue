<template>
  <!-- <div class="editor-actions">
      <v-btn @click="save()" icon>
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
  </div>-->
  <div id="editor-overview"></div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

export default {
  props: ["data", "setCategoryValue"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.editor = new EditorJS({
      holderId: "editor-overview",
      tools: {
        header: Header,
        list: List
      },
      data: JSON.parse(this.data)
    });
  },
  methods: {
    async save() {
      let outputData = await this.editor.save();
      let data = JSON.stringify(outputData);
      this.setCategoryValue("overview", data);
    }
  }
  // mounted() {
  //   setTimeout(() => {
  //     document.querySelectorAll("[contenteditable=true]").forEach(item => {
  //       item.setAttribute("contenteditable", "false");
  //     });
  //   }, 1000);
  // }
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