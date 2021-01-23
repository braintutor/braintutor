<template>
  <div>
    <v-select
      @change="choose"
      :items="teachers"
      item-text="name"
      item-value="_id"
      label="Profesor"
      class="mt-4"
    ></v-select>
  </div>
</template>

<script>
export default {
  data: () => ({
    teachers: [],
  }),
  async created() {
    let teachers = this.mongoArr(await this.$api.teacher.getAll());
    this.teachers = teachers.map((t) => ({
      ...t,
      name: `${t.last_name}, ${t.first_name}`,
    }));
  },
  methods: {
    choose(item) {
      const choosed = this.teachers.find((t) => t._id === item);
      this.$emit("choose", choosed);
    },
  },
};
</script>

<style></style>
