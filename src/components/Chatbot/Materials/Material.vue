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
        <!-- Category Explanation -->
        <div v-show="category_selected == 'explanation'" id="explanation-editor" class="category"></div>
        <!-- Category Examples -->
        <div v-show="category_selected == 'examples'" id="examples-editor" class="category"></div>
        <!-- Category Movies -->
        <div v-show="category_selected == 'movies'" id="movies-editor" class="category"></div>
        <!-- Category Images -->
        <div v-show="category_selected == 'images'" id="images-editor" class="category"></div>
        <!-- Category Hyperlinks -->
        <div v-show="category_selected == 'hyperlinks'" id="hyperlinks-editor" class="category"></div>
        <!-- Category Exercises -->
        <Exercises
          class="category category-text"
          v-if="category_selected == 'exercises'"
          :exercises="material[category_selected]"
          :talk="text => {startTalk(text)}"
        />
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
      <div class="material-actions elevation-3">
        <v-btn small class="material-action" icon @click="setCategory(category_idx - 1)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <div
          class="item"
          :class="[`item--${category === 'quizzes'? 'qui': 'mat'}`, `${category_idx === idx ? 'item--active': ''}`]"
          v-for="(category, idx) in categories"
          :key="idx"
          @click="setCategory(idx)"
        ></div>
        <v-btn small class="material-action" icon @click="setCategory(category_idx + 1)">
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
import LinkTool from "@editorjs/link";

import Exercises from "./Exercises";
import Quizzes from "./Quizzes";

export default {
  props: [
    "material",
    "categories",
    "category_idx",
    "unselectMaterial",
    "setCategory"
  ],
  data: () => ({
    editors: {}
  }),
  mounted() {
    ["explanation", "examples", "movies", "images", "hyperlinks"].forEach(
      category => {
        this.editors[category] = new EditorJS({
          holderId: `${category}-editor`,
          tools: {
            header: Header,
            list: List,
            image: SimpleImage,
            marker: Marker,
            embed: Embed,
            linkTool: {
              class: LinkTool,
              config: {
                // endpoint: "http://localhost:5000/getLinkPreview"
                endpoint:
                  "https://braintutor-service-v2.herokuapp.com/getLinkPreview"
              }
            }
          },
          data: JSON.parse(this.material[category])
        });
      }
    );
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

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

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
}

.category {
  margin-bottom: 18px;
  border-radius: 10px;
  @include box-shadow;

  &.category-text {
    padding: 20px;
    .category-text-menu {
      padding-bottom: 12px; // padding - padding-bottom
      display: flex;
      justify-content: space-between;
      .category-text-title {
        font-size: 1.2rem;
        font-weight: bold;
        margin-right: 10px;
      }
    }
    .category-text-content {
      font-size: 0.9rem;
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
  // &.category-video {
  //   iframe {
  //     border: none;
  //     border-radius: 10px;
  //   }
  // }
  // &.category-document {
  //   height: 100%;
  //   embed {
  //     border: none;
  //     border-radius: 10px;
  //     height: 100%;
  //     width: 100%;
  //   }
  // }
}

.material-navigator {
  position: absolute;
  width: 100%;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  .material-actions {
    width: max-content;
    padding: 8px 0;
    margin: 0 auto 8px auto;
    background: #fff;
    border-radius: 40px;
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

.item {
  margin: 0 4px;
  width: 22px;
  height: 22px;
  border-radius: 100%;
  transition: all 0.2s;

  &--mat {
    border: 2px solid #4dc54b;
    &:hover {
      background: #80e27e;
    }
    &.item--active {
      background: #80e27e;
    }
  }

  &--qui {
    border: 2px solid #ddaf5a;
    &:hover {
      background: #e5c280;
    }
    &.item--active {
      background: #e5c280;
    }
  }
}

//
[id$="-editor"] {
  padding: 20px;
  pointer-events: none;
}
#movies-editor {
  pointer-events: all !important;
}
#hyperlinks-editor {
  pointer-events: all !important;
}
</style>