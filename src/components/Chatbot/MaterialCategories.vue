<template>
  <div>
    <div class="material">
      <!-- Body -->
      <div class="material__body">
        <DocumentEditor
          v-show="category === 'explanation'"
          :id="'explanation'"
          :data="material['explanation']"
          hideControls
          readonly
        />
        <DocumentEditor
          v-show="category === 'examples'"
          :id="'examples'"
          :data="material['examples']"
          hideControls
          readonly
        />
        <DocumentEditor
          v-show="category === 'movies'"
          :id="'movies'"
          :data="material['movies']"
          hideControls
          readonly
        />
        <DocumentEditor
          v-show="category === 'images'"
          :id="'images'"
          :data="material['images']"
          hideControls
          readonly
        />
        <DocumentEditor
          v-show="category === 'hyperlinks'"
          :id="'hyperlinks'"
          :data="material['hyperlinks']"
          hideControls
          readonly
        />
        <Exercises
          v-show="category === 'exercises'"
          :exercises="material['exercises']"
          class="mcontainer"
        />
        <div v-show="category === 'faq'" class="mcontainer">
          <h2 class="faq__title">Preguntas Frecuentes</h2>
          <div v-for="(faq, idx) in material['faq']" :key="idx" class="faq">
            <p class="faq__question">{{faq.question}}</p>
            <p class="faq__answer">{{faq.answer}}</p>
          </div>
        </div>
        <Quizzes v-show="category === 'quizzes'" :quizzes="material['quizzes']" />
      </div>
      <!-- Actions -->
      <div class="material__actions">
        <button v-show="category_idx > 0" @click="move(-1)" class="button button--secondary">
          <v-icon class="mr-2" style="color: #fff; font-size: 1.3rem">mdi-arrow-left</v-icon>Anterior
        </button>
        <div></div>
        <button
          v-show="category_idx < categories.length - 2"
          @click="move(1)"
          class="button button--secondary"
        >
          Siguiente
          <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem">mdi-arrow-right</v-icon>
        </button>
        <button
          v-show="category_idx === categories.length - 2"
          @click="move(1)"
          class="button button--special"
        >
          Examen
          <v-icon class="ml-1" style="color: #fff; font-size: 1.3rem">mdi-arrow-right</v-icon>
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
    material: Object
  },
  data: () => ({
    categories: [
      "explanation",
      "movies",
      "images",
      "examples",
      "exercises",
      "hyperlinks",
      "faq",
      "quizzes"
    ],
    category_idx: 0
  }),
  computed: {
    category: {
      get: function() {
        return this.categories[this.category_idx];
      },
      set: function(value) {
        this.category_idx = this.categories.indexOf(value);
      }
    }
  },
  mounted() {
    this.category = this.material.default || "explanation";
  },
  methods: {
    move(dir) {
      this.category_idx = Math.max(
        0,
        Math.min(this.category_idx + dir, this.categories.length - 1)
      );
      scrollTop();
    }
  },
  components: {
    DocumentEditor,
    Exercises,
    Quizzes
  }
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 650px;
  margin: 0 auto;
}

.material {
  &__body {
    margin-top: 20px;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
  }
}

.button {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 0.9rem;
  border-radius: 4px;
  transition: 0.4s;

  &:hover {
    background: #e4e4e4;
  }
  &:focus {
    outline: none;
  }

  &--secondary {
    background: #5553ff;
    color: #fff;

    &:hover {
      background: #3735b3;
    }
  }
  &--special {
    background: #ff8e31;
    color: #fff;

    &:hover {
      background: #db7018;
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
    white-space: pre-wrap;
  }
}
</style>