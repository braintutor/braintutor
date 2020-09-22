<template>
  <div>
    <div class="filters">
      <div class="filter">
        <span class="filter__name">Aula:</span>
        <v-select
          class="filter__input"
          v-model="classroom_id"
          :items="classrooms"
          item-value="_id"
          item-text="name"
          label="Aula"
          dense
          solo
        ></v-select>
      </div>
      <!-- <div class="filter">
        <span class="filter__name">Periodo:</span>
        <v-select
          class="filter__input"
          v-model="period"
          :items="periods"
          label="Periodo"
          dense
          solo
        ></v-select>
      </div>-->
    </div>
    <Classroom ref="classroom_component" v-if="classroom_id" :classroom_id="classroom_id.$oid" />
    <div v-else class="text-center mt-4">Seleccione un Aula</div>
  </div>
</template>

<script>
import Classroom from "./Classroom";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";

export default {
  data: () => ({
    classroom_id: null,
    classrooms: [],
    //
    period: "Día",
    periods: ["Día", "Mes", "Año"],
  }),
  watch: {
    classroom_id() {
      if (this.$refs.classroom_component)
        this.$refs.classroom_component.reset();
    },
  },
  mounted() {
    this.getClassrooms();
  },
  methods: {
    async getClassrooms() {
      this.showLoading("Cargando Aulas");
      try {
        this.classrooms = await getClassroomsBySchoolDirector();
        this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
      this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    Classroom,
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/filters";
</style>