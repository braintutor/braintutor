<template>
  <div class="resource-container m-fullscreen">
    <div class="resource-navigator">
      <v-btn icon @click="unselectResource()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="resource-title">{{resource_selected.nombre}}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="changeItem(-1)">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="changeItem(1)">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-btn icon @click="Prueba()">
        <v-icon>mdi-volume-high</v-icon>
      </v-btn>
    </div>
    <div class="m-fullscreen-content">
      <div class="resource-content elevation-3">
        <div v-if="item_selected == 'texto'" class="resource-item-text">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'video'" class="resource-item-video aspect-ratio-video">
          <iframe
            class="aspect-ratio-content"
            :src="resource_selected[item_selected]"
            allowfullscreen
          />
        </div>
        <div v-if="item_selected == 'documento'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'imagen'" class="resource-item-image">
          <img :src="resource_selected[item_selected]" alt />
        </div>
        <div v-if="item_selected == 'quiz'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'ejemplos'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'importancia'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'explicacion'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <div v-if="item_selected == 'faq'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["resource_selected"],
  data: () => ({
    item_idx: 0,
    items: [
      "texto",
      "video",
      "documento",
      "imagen",
      "quiz",
      "ejemplos",
      "importancia",
      "explicacion",
      "faq"
    ]
  }),
  computed: {
    component_avatar() {
      return this.$store.state.component_avatar;
    },
    item_selected() {
      return this.items[this.item_idx];
    }
  },
  methods: {
    unselectResource() {
      this.$store.commit("setResourceSelected", null);
    },
    changeItem(direction) {
      this.item_idx = Math.max(
        0,
        Math.min(this.item_idx + direction, this.items.length - 1)
      );
    },
    Prueba() {
      this.component_avatar.starTalk(this.resource_selected.texto);
    }
  }
};
</script>

<style lang='scss' scoped>
.resource-container {
  height: 100%;
  .resource-navigator {
    padding: 10px;
    display: flex;
    align-items: center;
    .resource-title {
      margin: 0 12px;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .resource-content {
    margin: 4%;
    margin-top: 1%;
    border-radius: 10px;

    .resource-item-text {
      padding: 30px;
      font-size: 20px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .resource-item-video iframe {
      border: none;
      border-radius: 10px;
    }
    .resource-item-image img {
      width: 100%;
      border-radius: 10px;
    }
  }
}
</style>