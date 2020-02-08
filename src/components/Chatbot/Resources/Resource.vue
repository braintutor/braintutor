<template>
  <div class="resource-container m-fullscreen">
    <div class="resource-menu">
      <v-btn icon @click="unselectResource()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="resource-title">{{resource_selected.nombre}}</span>
    </div>
    <div class="m-fullscreen-content">
      <div class="resource-content">
        <!-- Item Text -->
        <div v-if="item_selected == 'texto'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">¿Qué es {{resource_selected.nombre}}?</div>
            <v-btn icon @click="starTalk(resource_selected[item_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="item-text-content">{{resource_selected[item_selected]}}</div>
        </div>
        <!-- Item Video -->
        <div v-if="item_selected == 'video'" class="item item-video aspect-ratio-video">
          <iframe
            class="aspect-ratio-content"
            :src="resource_selected[item_selected]"
            allowfullscreen
          />
        </div>
        <!-- Item Document -->
        <div v-if="item_selected == 'documento'" class="item item-document">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <!-- Item Image -->
        <div v-if="item_selected == 'imagen'" class="item item-image">
          <img :src="resource_selected[item_selected]" alt />
        </div>
        <!-- Item Quiz -->
        <div v-if="item_selected == 'quiz'">
          <span>{{resource_selected[item_selected]}}</span>
        </div>
        <!-- Item Example -->
        <div v-if="item_selected == 'ejemplos'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">Ejemplos</div>
          </div>
          <div
            v-for="(example, e_idx) in resource_selected[item_selected]"
            :key="e_idx"
            class="item-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <div>{{example}}</div>
          </div>
        </div>
        <!-- Item Importance -->
        <div v-if="item_selected == 'importancia'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">¿Por qué es importante {{resource_selected.nombre}}?</div>
            <v-btn icon @click="starTalk(resource_selected[item_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="item-text-content">{{resource_selected[item_selected]}}</div>
        </div>
        <!-- Item Explication -->
        <div v-if="item_selected == 'explicacion'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">Para más información</div>
          </div>
          <div
            v-for="(url, f_idx) in resource_selected[item_selected]"
            :key="f_idx"
            class="item-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <a :href="url.enlace" target="_blank">{{url.nombre}}</a>
          </div>
        </div>
        <!-- Item FAQ -->
        <div v-if="item_selected == 'faq'">
          <div
            v-for="(faq, f_idx) in resource_selected[item_selected]"
            :key="f_idx"
            class="item item-text"
          >
            <div class="item-text-menu">
              <div class="item-text-title">{{faq.pregunta}}</div>
              <v-btn icon @click="starTalk(`${faq.pregunta}. ${faq.respuesta}`)">
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
            </div>
            <div class="item-text-content">
              <div>{{faq.respuesta}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="resource-navigator">
      <div class="resource-actions elevation-3">
        <v-btn class="resource-action" icon @click="changeItem(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="resource-action">{{`${item_idx + 1}/${items.length}`}}</span>
        <v-btn class="resource-action" icon @click="changeItem(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
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
    starTalk(text) {
      this.component_avatar.starTalk(text);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.resource-container {
  position: relative;
  height: 100%;

  .resource-menu {
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
    margin: 0 4% 60px;
  }
  .resource-navigator {
    position: absolute;
    width: 100%;
    bottom: 0;

    .resource-actions {
      width: max-content;
      padding: 8px 6px;
      margin: 0 auto;
      background: #fff;
      border-radius: 10px 10px 0 0;
      opacity: 0.5;
      transition: all 0.5s;
      display: flex;
      align-items: center;

      &:hover {
        cursor: pointer;
        opacity: 1;
      }
      .resource-action {
        margin: 0 8px;
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}

.item {
  margin: 20px 0;
  border-radius: 10px;
  @include box-shadow;

  &.item-text {
    padding: 28px;
    padding-bottom: 10px;
    .item-text-menu {
      padding-bottom: 18px; // padding - padding-bottom
      display: flex;
      justify-content: space-between;
      .item-text-title {
        font-size: 23px;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .item-text-content {
      padding-bottom: 18px; // padding - padding-bottom
      font-size: 18px;
      white-space: pre-wrap;
      display: flex;
      align-items: flex-start;
    }
  }
  &.item-image img {
    width: 100%;
    border-radius: 10px;
  }
  &.item-video iframe {
    border: none;
    border-radius: 10px;
  }
  &.item-document {
  }
}
</style>