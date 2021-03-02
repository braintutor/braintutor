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
    this.items = this.mongoArr(await this.$api.grade.getAll()).map( x =>  { return {...x, fullName: x["name"] + '° ' + x["level"] }})
  },
  methods: {
    choose(item) {
      this.$emit("choose", item);
    },
  },
};
</script>

<style></style>
