<template>
  <div>
    <loading :active="loading" :message="loading_message" />
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
      </div> -->
    </div>
    <Classroom v-if="classroom_id" :classroom_id="classroom_id.$oid" />
    <div v-else class="no-classroom">Seleccione un Aula.</div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import Classroom from "./Classroom";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";

export default {
  data: () => ({
    classroom_id: null,
    classrooms: [],
    //
    loading: true,
    loading_message: "",
    period: "Día",
    periods: ["Día", "Mes", "Año"]
  }),
  mounted() {
    this.getClassrooms();
  },
  methods: {
    async getClassrooms() {
      this.loading = true;
      this.loading_message = "Cargando Aulas";
      this.classrooms = await getClassroomsBySchoolDirector();
      this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      this.loading = false;
    }
  },
  components: {
    loading,
    Classroom
  }
};
</script>

<style lang='scss' scoped>
@import '@/styles/filters';

.no-classroom {
  margin: 20px 0;
  color: #646464;
  text-align: center;
  font-size: 1.1rem;
  font-weight: lighter;
}
</style>