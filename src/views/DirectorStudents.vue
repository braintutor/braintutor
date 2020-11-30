<template>
  <div class="m-container px-1">
    <Students :students="students">
      <v-row no-gutters class="mb-3">
        <v-col class="col-4 px-2">
          <v-select
            v-model="level_selected"
            :items="levels"
            item-text="name"
            item-value="_id"
            label="Nivel"
          ></v-select>
        </v-col>
        <v-col class="col-4 px-2">
          <v-select
            v-model="grade_id"
            :items="grades_f"
            item-value="_id"
            item-text="name"
            label="Grado"
          ></v-select>
        </v-col>
        <v-col class="col-4 px-2">
          <v-select
            v-show="sections.length > 0"
            v-model="section_id"
            :items="sections"
            item-text="name"
            item-value="_id"
            label="Sección"
          ></v-select>
        </v-col>
      </v-row>

      <div v-show="section_id && students.length <= 0" class="text-center mt-3">
        No hay Alumnos
      </div>
    </Students>
  </div>
</template>

<script>
import Students from "@/components/globals/Students/index";

export default {
  data: () => ({
    grades: [],
    grade_id: null,
    sections: [],
    section_id: null,
    students: [],
    levels: [
      {
        _id: "PRI",
        name: "Primaria",
      },
      {
        _id: "SEC",
        name: "Secundaria",
      },
    ],
    level_selected: "PRI",
  }),
  computed: {
    grades_f() {
      return this.grades.filter((g) => g.level === this.level_selected);
    },
  },
  watch: {
    level_selected() {
      this.grade_id = null;
    },
    async grade_id() {
      this.section_id = null;
      this.sections = [];

      if (this.grade_id) {
        this.showLoading("Cargando Aulas");
        try {
          this.sections = this.mongoArr(
            await this.$api.section.getAll({
              grade_id: this.grade_id,
            })
          );
          this.sections.sort((a, b) => a.name.localeCompare(b.name));
          this.section_id = this.sections[0] ? this.sections[0]._id : null;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
    async section_id() {
      this.students = [];

      if (this.section_id) {
        this.showLoading("Cargando Alumnos");
        try {
          this.students = this.mongoArr(
            await this.$api.student.getAll({
              grade_id: this.grade_id,
              section_id: this.section_id,
            })
          );
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    try {
      let grades = this.mongoArr(await this.$api.grade.getAll());
      grades.sort((a, b) => a.name.localeCompare(b.name));
      this.grades = grades;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Students,
  },
};
</script>

<style>
</style>