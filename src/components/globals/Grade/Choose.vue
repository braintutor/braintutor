<template>
  <div>
    <v-select
      @change="choose"
      :items="items"
      item-text="fullName"
      item-value="_id"
      label="Grado"
      class="mt-4"
    ></v-select>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [],
  }),
  async created() {
    let grades = this.mongoArr(await this.$api.grade.getAll());
    grades.sort((a, b) => a.name.localeCompare(b.name));
    this.items = [
      ...grades.filter((g) => g.level === "PRI"),
      ...grades.filter((g) => g.level === "SEC"),
    ].map( x =>  { return {...x, fullName: x["name"] + '° ' + x["level"] }})
    console.log(this.items)
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
