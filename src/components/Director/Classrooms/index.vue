<template>
  <div v-if="!classroom">
    <loading :active="loading" :message="loading_message" />
    <div class="period" slot="default">
      <span class="period__text">Mostrar resultados por:</span>
      <v-select class="period__select" v-model="period" :items="periods" label="Periodo" dense solo></v-select>
    </div>
    <div class="row no-gutters mt-1">
      <div
        class="col-6 col-md-4 col-lg-3 px-2 py-2"
        v-for="(classroom, c_idx) in classrooms"
        :key="c_idx"
      >
        <Card :callback="() => select(classroom)">
          <p class="card-item">{{classroom.name}}</p>
        </Card>
      </div>
    </div>
  </div>
  <Classroom v-else :classroom="classroom" :getClassrooms="getClassrooms" :unselect="unselect" />
</template>

<script>
import loading from "@/components/loading";
import Card from "@/components/Card";
import Classroom from "./Classroom";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";

export default {
  data: () => ({
    classroom: null,
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
    },
    select(classroom) {
      this.classroom = classroom;
    },
    unselect() {
      this.classroom = null;
    }
  },
  components: {
    loading,
    Card,
    Classroom
  }
};
</script>

<style lang='scss' scoped>
.period {
  display: flex;
  justify-content: center;
  align-items: center;
  &__text {
    margin-right: 10px;
  }
  &__select {
    max-width: 100px;
  }
}
</style>