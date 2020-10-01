<template>
  <div class="m-container px-1">
    <Students :students="students">
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-value="_id"
        item-text="name"
        label="Aula"
        class="px-2 mb-3"
      ></v-select>
      <div v-show="!classroom_id" class="text-center mt-3">
        Seleccione un Aula
      </div>
    </Students>
  </div>
</template>

<script>
import Students from "@/components/globals/Students/index";

export default {
  data: () => ({
    classrooms: [],
    students: [],
    classroom_id: null,
  }),
  watch: {
    async classroom_id() {
      this.$router
        .push({
          query: { classroom_id: this.classroom_id },
        })
        .catch(() => {});
      await this.getStudents(this.classroom_id);
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    let classroom_id = this.$route.query.classroom_id;
    try {
      this.classrooms = this.mongoArr(await this.$api.classroom.getAll());
      if (this.classrooms.map((c) => c._id).includes(classroom_id))
        this.classroom_id = classroom_id;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async getStudents(classroom_id) {
      if (!classroom_id) return;

      this.showLoading("Cargando Alumnos");
      try {
        this.students = this.mongoArr(
          await this.$api.student.getAll(classroom_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    Students,
  },
};
</script>

<style>
</style>