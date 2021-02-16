<template>
  <div>
    <v-select
      @change="choose"
      :value="value"
      :items="items"
      item-text="name"
      item-value="id"
      label="Materia"
      class="mt-4"
      return-object
    ></v-select>
  </div>
</template>

<script>
import { index } from "@/services/subjectService"
export default {
  data: () => ({
    items: [],
  }),
  props: ["value"],
  async created() {
    this.items = await index()
  },
  methods: {
    choose(item) {
    this.$emit("choose", item);
    },
  },
};
</script>

<style></style>
