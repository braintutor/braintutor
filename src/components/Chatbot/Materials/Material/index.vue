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
        <!-- <div
          v-show="category_selected == 'overview'"
          class="category category-text"
        >{{material.overview}}</div>-->
        <!-- Category Explanation -->
        <div v-show="category_selected == 'explanation'" id="explanation-editor" class="category"></div>
        <!-- Category Examples -->
        <div v-show="category_selected == 'examples'" id="examples-editor" class="category"></div>
        <!-- Category Movies -->
        <div v-show="category_selected == 'movies'" id="movies-editor" class="category"></div>
        <!-- Category Bullets -->
        <div v-if="category_selected == 'bullets'" class="category category-text">
          <div class="category-text-menu">
            <div class="category-text-title">{{material.name}}</div>
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
        <!-- Category Exercises -->
        <Exercises
          class="category category-text"
          v-if="category_selected == 'exercises'"
          :exercises="material[category_selected]"
          :talk="text => {startTalk(text)}"
        />
        <!-- Category Images -->
        <div v-if="category_selected == 'images'">
          <div
            v-for="(image, i_idx) in material[category_selected]"
            :key="i_idx"
            class="category category-image"
          >
            <img :src="image" />
          </div>
        </div>
        <!-- Category FAQ -->
        <div v-if="category_selected == 'faq'">
          <div
            v-for="(faq, f_idx) in material[category_selected]"
            :key="f_idx"
            class="category category-text"
          >
            <div class="category-text-menu">
              <div class="category-text-title">{{faq.question}}</div>
            </div>
            <div class="category-text-content">
              <div>{{faq.answer}}</div>
            </div>
          </div>
        </div>
        <!-- Category Quizzes -->
        <div v-if="category_selected == 'quizzes'">
          <Quizzes :quizzes="material.quizzes" />
        </div>
        <!-- Category Document
        <div v-if="category_selected == 'documento'" class="category category-document">
          <embed :src="material[category_selected]" alt />
        </div>-->
      </div>
    </div>
    <div class="material-navigator">
      <!-- <div v-for="(category, idx) in categories" :key="idx">{{category}}</div> -->
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
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import Embed from "@editorjs/embed";

import Exercises from "./Exercises";
import Quizzes from "@/components/Chatbot/Quizzes/index";
// import { getEmbed } from "@/services/embed";

export default {
  props: [
    "material",
    "categories",
    "category_idx",
    "unselectMaterial",
    "changeCategory"
  ],
  data: () => ({
    editors: {}
  }),
  mounted() {
    ["explanation", "examples", "movies"].forEach(category => {
      this.editors[category] = new EditorJS({
        holderId: `${category}-editor`,
        tools: {
          header: Header,
          list: List,
          image: SimpleImage,
          marker: Marker,
          embed: Embed
        },
        data: JSON.parse(this.material[category])
      });
    });
    // this.material.movies = this.material.movies.map(movie => getEmbed(movie));
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
    Exercises,
    Quizzes
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";
.material-content .codex-editor__redactor {
  margin-right: 0 !important;
}

.material-container {
  position: relative;

  .material-menu {
    padding: 8px;
    padding-top: 3px;
    display: flex;
    align-items: center;
    .material-title {
      margin: 0 12px;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .material-content {
    padding: 5px 20px 56px 20px;
  }
  .material-navigator {
    position: absolute;
    width: 100%;
    bottom: 0;
    pointer-events: none;
    z-index: 1;
    .material-actions {
      width: max-content;
      padding: 8px 6px;
      margin: 0 auto 8px auto;
      background: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      pointer-events: all;
      &:hover {
        cursor: pointer;
      }
      .material-action {
        margin: 0 8px;
        font-weight: bold;
        font-size: 1.5rem;
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
        font-size: 1.4rem;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .category-text-content {
      padding-bottom: 16px; // padding - padding-bottom
      font-size: 1rem;
      white-space: pre-wrap;
      display: flex;
      align-items: flex-start;
    }
  }
  &.category-image img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
    border-radius: 10px;
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

[id$="-editor"] {
  padding: 20px;
  pointer-events: none;
}
#movies-editor {
  pointer-events: all !important;
}
</style>