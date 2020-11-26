<template>
  <div class="m-container px-1">
    <Students :students="students">
      <v-select
        v-model="grade_id"
        :items="grades"
        item-value="_id"
        item-text="name"
        label="Aula"
        class="px-2 mb-2"
      ></v-select>
      <v-select
        v-show="sections.length > 0"
        v-model="section_id"
        :items="sections"
        item-text="name"
        item-value="_id"
        label="Sección"
        class="px-2 mb-4"
      ></v-select>
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
  }),
  watch: {
    async grade_id() {
      this.$router
        .push({
          query: { grade_id: this.grade_id },
        })
        .catch(() => {});

      if (this.grade_id) {
        this.$router
          .push({
            query: { grade_id: this.grade_id },
          })
          .catch(() => {});

        this.showLoading("Cargando Aulas");
        this.sections = [];
        this.students = [];
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
      if (this.section_id) {
        this.showLoading("Cargando Alumnos");
        this.students = [];
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
    let grade_id = this.$route.query.grade_id;
    try {
      let grades = this.mongoArr(await this.$api.grade.getAll());
      grades.sort((a, b) => a.name.localeCompare(b.name));
      this.grades = [
        ...grades.filter((g) => g.level === "PRI"),
        ...grades.filter((g) => g.level === "SEC"),
      ];

      if (this.grades.map((g) => g._id).includes(grade_id))
        this.grade_id = grade_id;
      else this.grade_id = this.grades[0] ? this.grades[0]._id : null;
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