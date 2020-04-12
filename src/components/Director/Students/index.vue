<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <v-select
      class = 'mb-4'
      v-model="classroom_id"
      :items="classrooms"
      item-value="_id"
      item-text="name"
      label="Aula"
      dense
      solo
    ></v-select>
    <Students :students="students" />
  </div>
</template>

<script>
import loading from "@/components/loading";
import Students from "./Students";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";
import { getStudentsByClassroomDirector } from "@/services/studentService";

export default {
  data: () => ({
    classroom_id: {},
    classrooms: [],
    students: [],
    //
    loading: true,
    loading_message: ""
  }),
  watch: {
    classroom_id() {
      this.select(this.classroom_id);
    }
  },
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
    async select() {
      this.loading = true;
      this.loading_message = "Cargando Alumnos";
      this.students = await getStudentsByClassroomDirector(
        this.classroom_id.$oid
      );
      this.loading = false;
    }
  },
  components: {
    loading,
    Students
  }
};
</script>

<style>
</style>