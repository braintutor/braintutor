<template>
  <div class="material-container m-fullscreen">
    <div class="material-menu">
      <v-btn icon @click="unselectMaterial()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <span class="material-title">{{material.name}}</span>
    </div>
    <div class="m-fullscreen-content">
      <div class="material-content">
        <!-- Category Overview -->
        <div v-if="category_selected == 'overview'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">{{material.name}}</div>
            <v-btn icon @click="startTalk(material[category_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="category-text-content">{{material[category_selected]}}</div>
        </div>
        <!-- Category Explanation -->
        <div v-if="category_selected == 'explanation'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">{{material.name}}</div>
            <v-btn icon @click="startTalk(material[category_selected])">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div class="category-text-content">{{material[category_selected]}}</div>
        </div>
        <!-- Category Bullets -->
        <div v-if="category_selected == 'bullets'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">{{material.name}}</div>
            <v-btn icon @click="startTalk(material[category_selected].join('. '))">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div
            v-for="(bullet, e_idx) in material[category_selected]"
            :key="e_idx"
            class="category-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <div>{{bullet}}</div>
          </div>
        </div>
        <!-- Category Hyperlinks -->
        <div v-if="category_selected == 'hyperlinks'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">Más información</div>
          </div>
          <div
            v-for="(hyperlink, f_idx) in material[category_selected]"
            :key="f_idx"
            class="category-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <a :href="hyperlink.link" target="_blank">{{hyperlink.name}}</a>
          </div>
        </div>
        <!-- Category Examples -->
        <div v-if="category_selected == 'examples'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">Ejemplos</div>
            <v-btn icon @click="startTalk(material[category_selected].join('. '))">
              <v-icon>mdi-volume-high</v-icon>
            </v-btn>
          </div>
          <div
            v-for="(example, e_idx) in material[category_selected]"
            :key="e_idx"
            class="category-text-content"
          >
            <v-icon class="mr-3">mdi-circle-medium</v-icon>
            <div>{{example}}</div>
          </div>
        </div>
        <!-- Category Exercises -->
        <Exercises
          v-if="category_selected == 'exercises'"
          :exercises="material[category_selected]"
          :talk="text => {startTalk(text)}"
        />
        <!-- Category Movies -->
        <div v-if="category_selected == 'movies'"> 
          <div v-for="(movie, m_idx) in material[category_selected]" :key="m_idx" class="category category-video aspect-ratio-video">
            <iframe class="aspect-ratio-content" :src="movie" allowfullscreen />
          </div>
        </div>
        <!-- Category Images -->
        <div v-if="category_selected == 'images'">
          <div v-for="(image, i_idx) in material[category_selected]" :key="i_idx" class="category category-image">
            <img :src="image" />
          </div>
        </div>
        <!-- Category FAQ -->
        <div v-if="category_selected == 'faq'">
          <div v-for="(faq, f_idx) in material[category_selected]" :key="f_idx" class="category category-text">
            <div class="category-text-menu">
              <div class="category-text-title">{{faq.question}}</div>
              <v-btn icon @click="startTalk(`${faq.question}. ${faq.answer}`)">
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
            </div>
            <div class="category-text-content">
              <div>{{faq.answer}}</div>
            </div>
          </div>
        </div>
        <!-- Category Document
        <div v-if="category_selected == 'documento'" class="category category-document">
          <embed :src="material[category_selected]" alt />
        </div> -->
      </div>
    </div>
    <div class="material-navigator">
      <div class="material-actions elevation-3">
        <v-btn class="material-action" icon @click="changeCategory(-1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span class="material-action">{{`${category_idx + 1}/${categories.length}`}}</span>
        <v-btn class="material-action" icon @click="changeCategory(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import Exercises from "./Exercises";

export default {
  props: ["material", "categories", "category_idx", "unselectMaterial", "changeCategory"],
  mounted() {
    this.category_idx = this.category_idx;
  },
  computed: {
    component_avatar() {
      return this.$store.state.component_avatar;
    },
    category_selected() {
      return this.categories[this.category_idx];
    }
  },
  methods: {
    startTalk(text) {
      this.component_avatar.startTalk(text);
    }
  },
  components: {
    Exercises
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.material-container {
  position: relative;

  .material-menu {
    padding: 10px;
    display: flex;
    align-items: center;
    .material-title {
      margin: 0 12px;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .material-content {
    height: 100%;
    padding: 20px;
    padding-top: 5px;
  }
  .material-navigator {
    position: absolute;
    width: 100%;
    bottom: 0;
    pointer-events: none;
    .material-actions {
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
      .material-action {
        margin: 0 8px;
        font-weight: bold;
        font-size: 1.5rem;
        // font-size: 18px;
      }
    }
  }
}

.category {
  margin-bottom: 20px;
  border-radius: 10px;
  @include box-shadow;

  &.category-text {
    padding: 28px;
    padding-bottom: 10px;
    .category-text-menu {
      padding-bottom: 16px; // padding - padding-bottom
      display: flex;
      justify-content: space-between;
      .category-text-title {
        font-size: 1.5rem;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .category-text-content {
      padding-bottom: 16px; // padding - padding-bottom
      font-size: 1.2rem;
      white-space: pre-wrap;
      display: flex;
      align-items: center;
    }
  }
  &.category-image img {
    width: 100%;
    border-radius: 10px;
    vertical-align: bottom;
  }
  &.category-video {
    iframe {
      border: none;
      border-radius: 10px;
    }
  }
  &.category-document {
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