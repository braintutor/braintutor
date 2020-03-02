<template>
  <div class="editor container">
    <div class="editor-actions">
      <v-btn @click="save()" icon>
        <v-icon>mdi-content-save</v-icon>
      </v-btn>
    </div>
    <div id="editor-explanation"></div>
  </div>
</template>

<script>
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";

export default {
  props: ["data", "saveMaterial"],
  data: () => ({
    editor: null
  }),
  mounted() {
    this.editor = new EditorJS({
      holderId: "editor-explanation",
      tools: {
        header: Header
      },
      data: JSON.parse(this.data)
    });
  },
  methods: {
    save() {
      this.editor
        .save()
        .then(outputData => {
          let data = JSON.stringify(outputData);
          this.saveMaterial("explanation", data);
        })
        .catch(error => {
          console.log("Saving failed: ", error);
        });
    }
  },
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