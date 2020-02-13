<template>
  <div class="resource-container m-fullscreen">
    <div class="resource-menu">
      <v-btn icon @click="unselectResource()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="resource-title">{{resource.nombre}}</span>
    </div>
    <div class="m-fullscreen-content">
      <div class="resource-content">
        <!-- Item Text -->
        <div v-if="item_selected == 'texto'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">{{resource.nombre}}</div>
            <v-btn icon @click="startTalk(resource[item_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="item-text-content">{{resource[item_selected]}}</div>
        </div>
        <!-- Item Video -->
        <div v-if="item_selected == 'video'" class="item item-video aspect-ratio-video">
          <iframe class="aspect-ratio-content" :src="resource[item_selected]" allowfullscreen />
        </div>
        <!-- Item Document -->
        <div v-if="item_selected == 'documento'" class="item item-document">
          <embed :src="resource[item_selected]" alt />
        </div>
        <!-- Item Image -->
        <div v-if="item_selected == 'imagen'" class="item item-image">
          <img :src="resource[item_selected]" alt />
        </div>
        <!-- Item Quiz -->
        <Quiz
          v-if="item_selected == 'quiz'"
          :quiz="resource[item_selected]"
          :talk="text => {startTalk(text)}"
        />
        <!-- Item Example -->
        <div v-if="item_selected == 'ejemplos'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">Ejemplos</div>
          </div>
          <div
            v-for="(example, e_idx) in resource[item_selected]"
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
            <div class="item-text-title">¿Por qué es importante?</div>
            <v-btn icon @click="startTalk(resource[item_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="item-text-content">{{resource[item_selected]}}</div>
        </div>
        <!-- Item Explication -->
        <div v-if="item_selected == 'explicacion'" class="item item-text">
          <div class="item-text-menu">
            <div class="item-text-title">Más información</div>
          </div>
          <div
            v-for="(url, f_idx) in resource[item_selected]"
            :key="f_idx"
            class="item-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <a :href="url.enlace" target="_blank">{{url.nombre}}</a>
          </div>
        </div>
        <!-- Item FAQ -->
        <div v-if="item_selected == 'faq'">
          <div v-for="(faq, f_idx) in resource[item_selected]" :key="f_idx" class="item item-text">
            <div class="item-text-menu">
              <div class="item-text-title">{{faq.pregunta}}</div>
              <v-btn icon @click="startTalk(`${faq.pregunta}. ${faq.respuesta}`)">
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
import Quiz from "./Quiz";

export default {
  props: ["resource", "items", "item_idx", "unselectResource", "changeItem"],
  mounted() {
    this.item_idx = this.item_idx;
  },
  computed: {
    component_avatar() {
      return this.$store.state.component_avatar;
    },
    item_selected() {
      return this.items[this.item_idx];
    }
  },
  methods: {
    startTalk(text) {
      this.component_avatar.startTalk(text);
    }
  },
  components: {
    Quiz
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.resource-container {
  position: relative;

  .resource-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    .resource-title {
      margin: 0 12px;
      font-size: calc(9.5px + 1vw);
      font-weight: bold;
    }
  }
  .resource-content {
    height: 100%;
    padding: 20px;
    padding-top: 5px;
  }
  .resource-navigator {
    position: absolute;
    width: 100%;
    bottom: 0;
    pointer-events: none;
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
      pointer-events: all;
      &:hover {
        cursor: pointer;
        opacity: 1;
      }
      .resource-action {
        margin: 0 8px;
        font-weight: bold;
        font-size: calc(11px + 1vw);
        // font-size: 18px;
      }
    }
  }
}

.item {
  margin-bottom: 20px;
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
        font-size: calc(10px + 1.4vw);
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .item-text-content {
      padding-bottom: 18px; // padding - padding-bottom
      font-size: calc(10px + 0.7vw);
      white-space: pre-wrap;
      display: flex;
      align-items: flex-start;
    }
  }
  &.item-image img {
    width: 100%;
    border-radius: 10px;
    vertical-align: bottom;
  }
  &.item-video {
    iframe {
      border: none;
      border-radius: 10px;
    }
  }
  &.item-document {
    height: 100%;
    embed {
      border: none;
      border-radius: 10px;
      height: 100%;
      width: 100%;
    }
  }
}
</style>