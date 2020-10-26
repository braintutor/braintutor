<template>
  <!-- QUIZ -->
  <section class="quiz">
    <!-- QUIZ MENU -->
    <div class="quiz__menu">
      <strong class="mt-1" style="opacity: 0.5"
        >({{ `${data.length}/${maxlength}` }})</strong
      >
      <div class="quiz__actions">
        <v-btn v-if="edit" @click="$emit('submit', data)" text small rounded>
          <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
        </v-btn>
        <v-btn
          v-if="edit"
          @click="
            edit = false;
            $emit('submit', data);
          "
          text
          small
          rounded
        >
          <v-icon class="mr-2" small>mdi-close</v-icon>Finalizar
        </v-btn>
        <v-btn v-else @click="edit = true" text small rounded>
          <v-icon class="mr-2" small>mdi-pencil</v-icon>Editar
        </v-btn>
      </div>
    </div>
    <!-- QUESTION -->
    <div v-for="(d, d_idx) in data" :key="d_idx" class="question mt-3">
      <section class="question__body m-card pa-3">
        <div v-if="edit" class="question__statement">
          <v-textarea
            v-model="d.question"
            :maxlength="QuestionModel.question.max_length"
            :counter="QuestionModel.question.max_length"
            class="mb-3"
            rows="1"
            auto-grow
            dense
          ></v-textarea>
          <v-btn @click="showFiles(d_idx)" icon class="ml-2">
            <v-icon>mdi-image</v-icon>
          </v-btn>
        </div>
        <p v-else class="mb-3" style="white-space: pre-line">
          {{ d.question }}
        </p>
        <!-- QUESTION IMAGE -->
        <div v-if="d.image" class="question__image">
          <img :src="d.image" />
          <v-btn
            v-if="edit"
            @click="
              d.image = null;
              $forceUpdate();
            "
            class="question__image-close"
            icon
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <!-- ALTERNATIVE -->
        <div
          v-for="(alternative, a_idx) in d.alternatives"
          :key="a_idx"
          class="alternative mt-2"
        >
          <input
            type="radio"
            v-model="d.correct"
            :value="a_idx"
            :disabled="!edit"
            class="mr-2"
          />
          <v-textarea
            v-model="d.alternatives[a_idx]"
            :disabled="!edit"
            :maxlength="QuestionModel.alternative.max_length"
            :counter="QuestionModel.alternative.max_length"
            hide-details
            rows="1"
            append.click
            auto-grow
            filled
            rounded
            dense
          ></v-textarea>
          <v-btn
            v-if="edit && d.alternatives.length > 2"
            @click="remove(d.alternatives, a_idx)"
            class="ml-2"
            small
            icon
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </div>
        <!-- ALTERNATIVE ADD -->
        <div
          v-if="
            edit &&
            d.alternatives.length < QuestionModel.alternatives.max_length
          "
          class="alternative"
        >
          <input
            type="radio"
            style="pointer-events: none; opacity: 0"
            class="mr-2"
          />
          <div
            @click="addAlternative(d.alternatives)"
            class="alternative--add mt-2"
          >
            +
          </div>
          <v-btn
            v-if="d.alternatives.length > 2"
            class="ml-2"
            style="pointer-events: none; opacity: 0"
            small
            icon
          >
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </div>
      </section>
      <!-- QUESTION MENU -->
      <div v-if="edit" class="ml-2">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" small icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list class="pa-0" dense>
            <v-list-item @click="moveUp(data, d_idx)">
              <v-list-item-title>Mover Arriba</v-list-item-title>
            </v-list-item>
            <v-list-item @click="moveDown(data, d_idx)">
              <v-list-item-title>Mover Abajo</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="remove(data, d_idx)"
              :disabled="data.length <= 1"
            >
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <!-- QUESTION ADD -->
    <div v-if="edit && data.length < maxlength" class="question">
      <div @click="addQuestion(data)" class="question--add mt-4">+</div>
      <v-btn class="ml-2" style="pointer-events: none; opacity: 0" small icon>
        <v-icon small>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>

    <!-- DLG FILES -->
    <v-dialog v-model="dlg_files" max-width="1000">
      <Files
        v-if="dlg_files"
        @file="onFileSelected"
        :document_type="document_type"
        :document_id="document_id"
        class="m-card pa-4"
      />
    </v-dialog>
  </section>
</template>

<script>
import Files from "@/components/globals/File/Files";

import QuestionModel from "@/models/Question";

export default {
  props: ["quiz", "maxlength", "document_type", "document_id"],
  data: () => ({
    data: [],
    edit: false,
    question_selected: -1,
    //
    dlg_files: false,
    //
    QuestionModel,
  }),
  watch: {
    quiz() {
      this.create();
    },
  },
  mounted() {
    this.create();
  },
  methods: {
    create() {
      try {
        this.data = JSON.parse(JSON.stringify(this.quiz));
      } catch (error) {
        this.data = [];
      }
    },
    addQuestion(arr) {
      arr.push({
        question: "Pregunta",
        alternatives: ["Alternativa", "Alternativa"],
        correct: 0,
      });
      this.$forceUpdate();
    },
    addAlternative(arr) {
      arr.push("Alternativa");
      this.$forceUpdate();
    },
    remove(arr, idx) {
      arr.splice(idx, 1);
      this.$forceUpdate();
    },
    moveUp(arr, idx) {
      if (idx > 0) {
        let aux = arr[idx];
        arr[idx] = arr[idx - 1];
        arr[idx - 1] = aux;
        this.$forceUpdate();
      }
    },
    moveDown(arr, idx) {
      if (idx < arr.length - 1) {
        let aux = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = aux;
        this.$forceUpdate();
      }
    },
    // Files
    showFiles(idx) {
      this.question_selected = idx;
      this.dlg_files = true;
    },
    onFileSelected(file) {
      this.dlg_files = false;
      this.data[this.question_selected].image = file.url;
    },
  },
  components: {
    Files,
  },
};
</script>

<style lang='scss' scoped>
.quiz {
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.question {
  display: flex;

  &__body {
    flex-grow: 1;
  }

  &__statement {
    display: flex;
  }

  &__image {
    position: relative;
    max-width: 80%;
    margin: 20px auto;
    img {
      display: block;
      max-width: 100%;
      margin: 0 auto;
    }
    &-close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  &--add {
    flex-grow: 1;
    padding: 20px;
    color: #ccc;
    font-size: 1.5rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 10px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
}

.alternative {
  display: flex;
  align-items: center;

  input[type="radio"] {
    cursor: pointer;
  }

  &--add {
    flex-grow: 1;
    padding: 2px;
    color: #ccc;
    font-size: 1.5rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 100px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>