<template>
  <!-- QUIZ -->
  <section class="quiz">
    <!-- QUIZ MENU -->
    <div class="quiz__menu">
      <v-btn v-if="edit" @click="$emit('submit', data)" text small rounded>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
      <v-btn v-if="edit" @click="edit = false; $emit('submit', data)" text small rounded>
        <v-icon class="mr-2" small>mdi-close</v-icon>Finalizar
      </v-btn>
      <v-btn v-else @click="edit = true" text small rounded>
        <v-icon class="mr-2" small>mdi-pencil</v-icon>Editar
      </v-btn>
    </div>
    <!-- QUESTION -->
    <div v-for="(d, d_idx) in data" :key="d_idx" class="question mt-3">
      <section class="question__body m-card pa-3">
        <v-textarea
          v-if="edit"
          v-model="d.question"
          class="mb-3"
          rows="1"
          auto-grow
          dense
          hide-details
        ></v-textarea>
        <p v-else class="mb-3">{{d.question}}</p>
        <!-- ALTERNATIVE -->
        <div v-for="(alternative, a_idx) in d.alternatives" :key="a_idx" class="alternative mt-2">
          <input type="radio" v-model="d.correct" :value="a_idx" :disabled="!edit" class="mr-2" />
          <v-textarea
            v-model="d.alternatives[a_idx]"
            :disabled="!edit"
            rows="1"
            append.click
            auto-grow
            filled
            rounded
            dense
            hide-details
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
        <div v-if="edit" class="alternative">
          <input type="radio" style="pointer-events: none; opacity: 0" class="mr-2" />
          <div @click="addAlternative(d.alternatives)" class="alternative--add mt-2">+</div>
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
            <v-list-item @click="remove(data, d_idx)">
              <v-list-item-title>Eliminar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>
    <!-- QUESTION ADD -->
    <div v-if="edit" class="question">
      <div @click="addQuestion(data)" class="question--add mt-4">+</div>
      <v-btn class="ml-2" style="pointer-events: none; opacity: 0" small icon>
        <v-icon small>mdi-dots-vertical</v-icon>
      </v-btn>
    </div>
  </section>
</template>

<script>
export default {
  props: ["quiz"],
  data: () => ({
    data: [],
    edit: false
  }),
  watch: {
    quiz() {
      this.create();
    }
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
        correct: 0
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
    }
  }
};
</script>

<style lang='scss' scoped>
.quiz {
  &__menu {
    display: flex;
    justify-content: flex-end;
  }
}

.question {
  display: flex;

  &__body {
    flex-grow: 1;
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