<template>
  <div class="container pa-0 pt-2">
    <!-- Documents -->
    <!-- <div>
      <v-btn v-for="(document, idx) in documents" :key="idx" small rounded outlined>{{idx + 1}}</v-btn>
    </div>-->

    <div class="menu">
      <v-btn @click="save()" small rounded outlined text>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
    </div>
    <!-- Document Editor -->
    <DocumentEditor
      v-for="(document, idx) in documents"
      :key="idx"
      :ref="`editor${idx}`"
      :id="`editor${idx}`"
      :data="document"
      hide-controls
    />
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

import { updateMaterialDocuments } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    documents: [],
    document_idx: 0,
  }),
  mounted() {
    this.documents =
      this.material.documents && this.material.documents.length > 0
        ? this.material.documents
        : ["{}"];
  },
  methods: {
    selectDocument(document, idx) {
      this.document = document;
      this.document_idx = idx;
    },
    async save() {
      this.showLoading("Guardando");
      let documents = [];
      for (let i = 0; i < this.documents.length; i++) {
        let editor = this.$refs[`editor${i}`][0];
        documents.push(await editor.getData());
      }

      try {
        await updateMaterialDocuments(this.material._id.$oid, documents);
        this.material.documents = documents;
      } catch (error) {
      this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    DocumentEditor,
  },
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