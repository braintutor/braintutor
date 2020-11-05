<template>
  <div>
    <div class="material">
      <!-- Actions -->
      <div v-show="false" class="material__actions mt-3 mb-8">
        <button v-show="category_idx > 0" @click="move(-1)" class="button">
          <v-icon style="color: #fff; font-size: 1.3rem">mdi-arrow-left</v-icon>
        </button>
        <div></div>
        <button
          v-show="category_idx < categories.length - 2"
          @click="move(1)"
          class="button"
        >
          <v-icon style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
        </button>
        <button
          v-show="category_idx === categories.length - 2"
          @click="move(1)"
          class="button button--special"
        >
          <v-icon style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
        </button>
      </div>
      <!-- Body -->
      <DocumentEditor
        v-show="category === 'explanation'"
        :id="'explanation'"
        :data="material.data_fs['explanation']"
        hideControls
        readonly
      />
      <DocumentEditor
        v-show="category === 'examples'"
        :id="'examples'"
        :data="material.data_fs['examples']"
        hideControls
        readonly
      />
      <DocumentEditor
        v-show="category === 'movies'"
        :id="'movies'"
        :data="material.data_fs['movies']"
        hideControls
        readonly
      />
      <DocumentEditor
        v-show="category === 'images'"
        :id="'images'"
        :data="material.data_fs['images']"
        hideControls
        readonly
      />
      <DocumentEditor
        v-show="category === 'hyperlinks'"
        :id="'hyperlinks'"
        :data="material.data_fs['hyperlinks']"
        hideControls
        readonly
      />
      <Exercises
        v-show="category === 'exercises'"
        :exercises="material.data_fs['exercises']"
        class="material mt-2"
      />
      <div v-show="category === 'faq'" class="material mt-2">
        <h2 class="faq__title">Preguntas Frecuentes</h2>
        <div
          v-for="(faq, idx) in material.data_fs['faq']"
          :key="idx"
          class="faq"
        >
          <p class="faq__question">{{ faq.question }}</p>
          <p class="faq__answer">{{ faq.answer }}</p>
        </div>
      </div>
      <!-- <Quizzes
        v-show="category === 'quizzes'"
        :quizzes="material['quizzes']"
        class="material mt-2"
      />-->
      <Quizzes v-show="false" />
      <div v-show="category === 'quizzes'" class="m-card complete">
        <div class="m-card__body">
          <h3>Material Completado</h3>
          <m-btn
            @click="$emit('next', material)"
            color="primary"
            small
            class="mt-4"
            >Ir al siguiente material</m-btn
          >
        </div>
      </div>
      <!-- Actions -->
      <div class="material__actions mb-3 mt-8">
        <button v-show="category_idx > 0" @click="move(-1)" class="button">
          <v-icon class="mr-2" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-left</v-icon
          >Anterior
        </button>
        <div></div>
        <button
          v-show="category_idx < categories.length - 2"
          @click="move(1)"
          class="button"
        >
          Siguiente
          <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
        </button>
        <button
          v-show="category_idx === categories.length - 2"
          @click="
            move(1);
            $emit('finish', material);
          "
          class="button button--special"
        >
          Finalizar
          <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem"
            >mdi-arrow-right</v-icon
          >
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";
import Exercises from "./Exercises";
import Quizzes from "./Quizzes";

import { scrollTop } from "@/services/scroll";

export default {
  props: {
    material: Object,
    categories: Array,
  },
  data: () => ({
    category_idx: 0,
  }),
  computed: {
    category: {
      get: function () {
        return this.categories[this.category_idx];
      },
      set: function (value) {
        this.category_idx = this.categories.includes(value)
          ? this.categories.indexOf(value)
          : 0;
      },
    },
  },
  mounted() {
    if (this.material.default) this.category = this.material.default;
  },
  methods: {
    move(dir) {
      this.category_idx = Math.max(
        0,
        Math.min(this.category_idx + dir, this.categories.length - 1)
      );
      scrollTop("scroll"); //desktop
      scrollTop("app__body"); //mobile
    },
  },
  components: {
    DocumentEditor,
    Exercises,
    Quizzes,
  },
};
</script>

<style lang='scss' scoped>
.material {
  &__actions {
    display: flex;
    justify-content: space-between;
  }
}

$color-btn-hover: rgb(218, 230, 255);

.button {
  padding: 10px 16px;
  color: var(--color-active);
  background: var(--background-active);
  font-weight: bold;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: 0.4s;

  & * {
    color: var(--color-active) !important;
  }

  &:hover {
    background: $color-btn-hover !important;
  }
  &:focus {
    outline: none;
  }

  &--special {
    $color-font: #d4891a;
    $color-btn: #ffe9c7;
    background: $color-btn;
    color: $color-font;
    & * {
      color: $color-font !important;
    }
    &:hover {
      background: $color-btn !important;
    }
  }
}

.faq {
  margin-bottom: 20px;
  padding: 16px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);

  &__title {
    margin: 0;
    margin-bottom: 16px;
  }
  &__question {
    margin: 0;
    margin-bottom: 10px;
    font-size: 1.1rem;
    font-weight: bold;
  }
  &__answer {
    margin: 0;
    color: #3d3d3d;
    font-size: 0.9rem;
    white-space: pre-line;
  }
}

.complete {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
}
</style>