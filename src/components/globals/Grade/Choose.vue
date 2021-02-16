<template>
  <div>
    <v-select
      @change="choose"
      :value="value"
      :items="items"
      item-text="fullName"
      item-value="_id"
      :label="label"
      class="mt-4"
      return-object
    ></v-select>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [],
  }),
  props: { 
    "value": String, 
    "label": { type: String, default: 'Grado' }
  },
  async created() {
    let grades = this.mongoArr(await this.$api.grade.getAll());
    grades.sort((a, b) => a.name.localeCompare(b.name));
    this.items = [
      ...grades.filter((g) => g.level === "PRI"),
      ...grades.filter((g) => g.level === "SEC"),
    ].map( x =>  { return {...x, fullName: x["name"] + '° ' + x["level"] }})
  },
  methods: {
    choose(item) {
      this.$emit("choose", item);
    },
  },
};
</script>

<style></style>
