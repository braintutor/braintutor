<template>
  <div>
    <div v-if="isReadonly">
      <h3>Respuesta:</h3>
      <p class="ma-0 mt-3">{{ answer.text }}</p>
    </div>
    <div v-else>
      <v-textarea
        v-model="answer.text"
        placeholder="Escribe tu respuesta"
        dense
        hide-details
      ></v-textarea>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evaluationId: null,
    value: {},
    isReadonly: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      answer: this.value,
    };
  },
  watch: {
    value: {
      handler: function(value) {
        this.answer = value;
      },
      immediate: true,
    },
    answer: {
      handler: function() {
        this.handleChange();
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectionFile(file) {
      this.$emit("selectedFile", file);
    },
    handleChange() {
      this.$emit("input", this.answer);
    },
  },
};
</script>

<style></style>
