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
    </div>

    <Students ref="students" v-show="classroom_id" :get="getStudents" />
    <div v-show="!classroom_id" class="text-center mt-4">Seleccione un Aula</div>
  </div>
</template>

<script>
import Students from "@/components/Students/index";

import { getClassroomsBySchoolDirector } from "@/services/classroomService";
import { getStudentsByClassroomDirector } from "@/services/studentService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    classroom_id: null,
    classrooms: [],
  }),
  watch: {
    classroom_id() {
      this.$refs.students.update();
    },
  },
  mounted() {
    this.getClassrooms();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async getClassrooms() {
      this.loading(true);
      this.loading_msg("Cargando Aulas");
      try {
        this.classrooms = await getClassroomsBySchoolDirector();
        this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    async getStudents() {
      if (this.classroom_id)
        return await getStudentsByClassroomDirector(this.classroom_id.$oid);
      else return [];
    },
  },
  components: {
    Students,
  },
};
</script>

<style lang='scss' scoped>
@import "@/styles/filters";
</style>