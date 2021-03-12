<template>
  <div>
    <div class="m-card">
      <div class="m-card__body">
        <div class="close-modal">
          <h3>Escojer material</h3>
          <v-btn class="mx-2" icon small @click="close">
            <v-icon> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <div class="">
          <div>
            <v-text-field
              label="Buscar:"
              placeholder="Escriba nombre de un material"
              filled
              rounded
              dense
              v-model="title"
              @blur="search"
            ></v-text-field>
          </div>
          <div>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="materials"
              item-key="id"
              show-select
              disable-pagination
              hide-default-footer
            >
              <template v-slot:item.title="{ item }">
                {{ item.title }}
              </template>
            </v-data-table>
          </div>

          <div>
            <v-btn @click="addToSyllabus">
              Agregar al syllabus
            </v-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["course", "unit"],

  data: () => ({
    selected: [],
    title: "",
    materials: [],
    headers: [{ text: "Nombre", value: "title" }],
  }),
  mounted() {
    this.getMaterials();
  },
  methods: {
    async getMaterials(title = "") {
      this.materials = await this.$api.marketplace.index(
        '602c076814056f36657b8096',
        title
      );
    },
    async search() {
      this.getMaterials(this.title);
    },
    close() {
      this.$emit("close");
    },
    addToSyllabus(){

    }
  },
};
</script>

<style></style>
