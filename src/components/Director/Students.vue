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
    </div>
    <Students ref="students" v-show="classroom_id" :get="getStudents" />
    <div v-show="!classroom_id" class="no-classroom">Seleccione un Aula.</div>
  </div>
</template>

<script>
import loading from "@/components/loading";
// import Students from "./Students";
import Students from "@/components/Students/index";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";
import { getStudentsByClassroomDirector } from "@/services/studentService";

export default {
  data: () => ({
    classroom_id: null,
    classrooms: [],
    students: [],
    //
    loading: true,
    loading_message: ""
  }),
  watch: {
    classroom_id() {
      this.$refs.students.update();
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
    async getStudents() {
      if (this.classroom_id)
        return await getStudentsByClassroomDirector(this.classroom_id.$oid);
      else return [];
    }
  },
  components: {
    loading,
    Students
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/filters";

.no-classroom {
  margin: 20px 0;
  color: #646464;
  text-align: center;
  font-size: 1.1rem;
  font-weight: lighter;
}
// .styles {
// position: relative;
// &::before {
//   content: "Selecciona un Aula";
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   background: #ffffffea;
//   color: #9b9b9b;
//   font-size: 1.5rem;
//   font-weight: bold;
//   border-radius: 10px;
//   box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
//     0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12) !important;
//   //
//   display: flex;
//   justify-content: center;
//   align-items: center;
// }
// &--active {
// }
// }
</style>