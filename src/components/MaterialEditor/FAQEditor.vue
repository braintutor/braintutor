<template>
  <section class="editor">
    <div class="editor__menu">
      <v-btn v-if="show_edit" @click="$emit('submit', data)" text small rounded>
        <v-icon class="mr-2" small>mdi-content-save</v-icon>Guardar
      </v-btn>
      <v-btn v-if="show_edit" @click="show_edit = false; $emit('submit', data)" text small rounded>
        <v-icon class="mr-2" small>mdi-close</v-icon>Finalizar
      </v-btn>
      <v-btn v-else @click="show_edit = true" text small rounded>
        <v-icon class="mr-2" small>mdi-pencil</v-icon>Editar
      </v-btn>
    </div>
    <!-- Questions -->
    <section v-for="(d, idx) in data" :key="idx" class="question">
      <div class="question__body m-card">
        <v-text-field
          v-if="show_edit"
          style="font-size: 1rem; font-weight: bold"
          v-model="d.question"
          placeholder="Pregunta"
          hide-details
          dense
        />
        <div style="font-size: 1rem; font-weight: bold" v-else>{{d.question}}</div>
        <v-textarea
          v-if="show_edit"
          class="mt-3"
          style="font-size: .9rem"
          v-model="d.answer"
          placeholder="Respuesta"
          hide-details
          dense
          rows="1"
          auto-grow
        />
        <div class="mt-3" style="font-size: .9rem" v-else>{{d.answer}}</div>
      </div>
      <v-menu v-if="show_edit" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="ml-2" v-bind="attrs" v-on="on" small icon>
            <v-icon style="font-size: 1.5rem">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="pa-0" dense>
          <v-list-item @click="moveUp(data, idx)">
            <v-list-item-title>Mover Arriba</v-list-item-title>
          </v-list-item>
          <v-list-item @click="moveDown(data, idx)">
            <v-list-item-title>Mover Abajo</v-list-item-title>
          </v-list-item>
          <v-list-item @click="removeQuestion(data, idx)">
            <v-list-item-title>Eliminar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </section>
    <!-- Question Add -->
    <section v-if="show_edit" class="question">
      <div class="question--add" @click="addQuestion()">+</div>
      <v-btn style="pointer-events: none; opacity: 0" class="ml-2" icon small>
        <v-icon style="font-size: 1.5rem">mdi-plus</v-icon>
      </v-btn>
    </section>
  </section>
</template>

<script>
export default {
  props: ["faq"],
  data: () => ({
    data: "",
    show_edit: false
  }),
  mounted() {
    this.data = JSON.parse(JSON.stringify(this.faq));
  },
  methods: {
    addQuestion() {
      this.data.push({
        question: "Pregunta",
        answer: "Respuesta"
      });
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
    removeQuestion(arr, idx) {
      arr.splice(idx, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.editor {
  &__menu {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
  }
}

.question {
  margin-bottom: 12px;
  display: flex;

  &__body {
    flex-grow: 1;
    padding: 18px;
  }

  &--add {
    flex-grow: 1;
    padding: 20px;
    color: #a5a5a5;
    text-align: center;
    font-size: 1.8rem;
    border: 2px dashed #ccc;
    border-radius: 10px;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      background: #eeeeee;
    }
  }
}
</style>