<template>
  <div>
    <v-select
      @change="choose"
      :items="items"
      item-text="name"
      item-value="_id"
      label="Materia"
      class="mt-4"
    ></v-select>
  </div>
</template>

<script>
import { index } from "@/services/subjectService"
export default {
  data: () => ({
    items: [],
  }),
  async created() {
    this.items = await index()
  },
  methods: {
    choose(item) {
      const choosed = this.items.find((t) => t._id === item);
      this.$emit("choose", choosed);
    },
  },
};
</script>

<style></style>
