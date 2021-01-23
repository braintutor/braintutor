<template>
  <div class="row no-gutters mt-2">
    <div class="col-4 pr-4">
      <v-select
        v-model="level_selected"
        :items="levels"
        item-text="name"
        item-value="_id"
        label="Nivel"
      ></v-select>
    </div>
    <div class="col-4 pr-2">
      <v-select
        v-model="grade_id"
        :items="grades_f"
        item-text="name"
        item-value="_id"
        label="Grado"
      ></v-select>
    </div>
    <div class="col-4 pl-2">
      <v-select
        v-show="sections.length > 0"
        v-model="section_id"
        :items="sections"
        item-text="name"
        item-value="_id"
        label="Sección"
      ></v-select>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    grades: [],
    grade_id: "",
    sections: [],
    section_id: "",

    level_selected: "PRI",
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
  }),
  async created() {
    let grades = this.mongoArr(await this.$api.grade.getAll());
    grades.sort((a, b) => a.name.localeCompare(b.name));
    this.grades = [
      ...grades.filter((g) => g.level === "PRI"),
      ...grades.filter((g) => g.level === "SEC"),
    ];
  },
  computed: {
    grades_f() {
      return this.grades.filter((g) => g.level === this.level_selected);
    },
  },
  watch: {
    level_selected() {
      this.grade_id = null;
      this.$emit("query", {});
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
      this.$emit("query", {
        grade_id: this.grade_id,
        section_id: this.section_id,
      });
    },
  },
};
</script>

<style></style>
