<template>
  <v-container>
    <v-row
      v-for="segment in segments"
      :key="segment.number"
      class="d-flex justify-space-around"
    >
      <v-col cols="3">
        <h4>{{ text }} {{ segment.number }}</h4>
      </v-col>
      <v-col>
        <date-input label="Inicio" v-model="segment.start" />
      </v-col>
      <v-col>
        <date-input label="Fin" v-model="segment.end" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import DateInput from "./DateInput";
export default {
  components: {
    DateInput,
  },
  props: {
    value: Array,
    text: String,
  },
  computed: {
    segments: {
      get() {
        return this.value;
      },
      set(date) {
        this.$emit("input", date);
      },
    },
  },
};
</script>

<style>
</style>