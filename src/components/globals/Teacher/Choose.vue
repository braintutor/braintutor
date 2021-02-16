<template>
  <div>
    <v-select
      @change="choose"
      :value="value"
      :items="teachers"
      item-text="name"
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
    teachers: [],
  }),
  props: {
    "value": String,
    "label": {
      type: String,
      default: "Profesor",
    },
  },
  async created() {
    let teachers = this.mongoArr(await this.$api.teacher.getAll());
    this.teachers = teachers.map((t) => ({
      ...t,
      name: `${t.last_name}, ${t.first_name}`,
    }));
  },
  methods: {
    choose(item) {
      this.$emit("choose", item);
    },
  },
};
</script>

<style></style>
