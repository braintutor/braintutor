<template>
  <div>
    <loading :active="loading" :message="loading_msg" />
    <!-- <p>{{material}}</p> -->
    <!-- Categories -->
    <div v-show="!category" class="container">
      <div class="row no-gutters">
        <div class="col-6 col-sm-3 px-1">
          <!-- Category -->
          <section class="category" @click="selectCategory('explanation')">
            <img
              class="category__image"
              src="https://www.iconarchive.com/download/i94273/bokehlicia/captiva/accessories-text-editor.ico"
              alt
            />
            <span class="category__name">{{categories['explanation']}}</span>
          </section>
        </div>
        <div class="col-6 col-sm-3 px-1">
          <!-- Category -->
          <section class="category" @click="selectCategory('movies')">
            <img
              class="category__image"
              src="https://www.iconarchive.com/download/i94273/bokehlicia/captiva/accessories-text-editor.ico"
              alt
            />
            <span class="category__name">{{categories['movies']}}</span>
          </section>
        </div>
      </div>
    </div>

    <!-- CategoryEditor -->
    <section v-if="category" class="editor">
      <div class="editor__menu">
        <div style="display: flex; align-items: center">
          <v-btn @click="category = null" icon small>
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="editor__title">{{categories[category]}}</span>
        </div>
        <v-btn @click="save()" small rounded text>
          <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
        </v-btn>
      </div>
      <TextEditor ref="text-editor" class="m-card" :data="material[category]" />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import TextEditor from "@/components/globals/TextEditor";

import { updateMaterialCategory } from "@/services/materialService";

export default {
  props: ["material"],
  data: () => ({
    category: null,
    categories: {
      explanation: "Explicación",
      movies: "Videos"
    },
    //
    loading: false,
    loading_msg: ""
  }),
  methods: {
    selectCategory(category) {
      this.category = category;
    },
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";

      let material_id = this.material._id.$oid;
      let category = this.category;
      let data = await this.$refs["text-editor"].getData();

      try {
        await updateMaterialCategory(material_id, category, data);
        this.material[category] = data;
      } catch (error) {
        this.$root.$children[0].showMessage("Error", error.msg);
      }

      this.loading = false;
    }
  },
  components: {
    loading,
    TextEditor
  }
};
</script>

<style lang='scss' scoped>
.category {
  padding: 10px;
  border-radius: 20px;
  transition: 0.5s;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    transform: scale(1.01);
    box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
      0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
  }

  &__image {
    // width: 100%;
    max-width: 50%;
  }
  &__name {
    margin-top: 8px;
    font-weight: bold;
  }
}

.editor {
  &__menu {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__title {
    margin-top: 1px;
    margin-left: 10px;
    font-size: 1.1rem;
    font-weight: bold;
  }
}
</style>