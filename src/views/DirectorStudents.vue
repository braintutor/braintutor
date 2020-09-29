<template>
  <div class="m-container pb-3 px-1">
    <div v-show="!student_selected">
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-value="_id"
        item-text="name"
        label="Aula"
      ></v-select>
      <div v-show="!classroom_id" class="text-center mt-3">
        Seleccione un Aula
      </div>

      <!-- Students -->
      <div v-show="classroom_id">
        <div class="search mt-2 mb-3">
          <input v-model="student_search" type="text" placeholder="Buscar" />
          <v-icon v-show="student_search" @click="student_search = ''"
            >mdi-close</v-icon
          >
        </div>
        <!-- Students List -->
        <div
          v-for="student in students_filtered"
          :key="student._id"
          @click="student_selected = student"
          class="student"
        >
          <div class="student__body">
            <div class="student__name">
              <v-icon class="mr-3">mdi-account-circle</v-icon>
              <span class="mt-1">{{
                `${student.last_name}, ${student.first_name}`
              }}</span>
            </div>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn class="ml-2" icon small v-on="on">
                  <v-icon style="font-size: 1.4rem">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="pa-0" dense>
                <v-list-item @click="student_selected = student">
                  <v-list-item-title>Ver Más</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
    </div>

    <!-- Student -->
    <div v-if="student_selected">
      <div class="m-menu">
        <div class="m-menu__left">
          <v-btn icon @click="student_selected = null">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>
      <Student :student="student_selected" />
    </div>
  </div>
</template>

<script>
import Student from "@/components/DirectorStudents/Student";

export default {
  data: () => ({
    classrooms: [],
    students: [],
    classroom_id: null,
    student_search: "",
    student_selected: null,
  }),
  computed: {
    students_filtered() {
      return this.students.filter(
        (s) =>
          s.first_name
            .toLowerCase()
            .includes(this.student_search.toLowerCase()) ||
          s.last_name.toLowerCase().includes(this.student_search.toLowerCase())
      );
    },
  },
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
    Student,
  },
};
</script>

<style lang='scss' scoped>
.search {
  padding-right: 16px;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);

  display: flex;
  justify-content: space-between;
  align-items: center;
  input[type="text"] {
    width: 100%;
    padding: 12px 16px;

    &:focus {
      outline: none;
    }
  }
}

.student {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &__name {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>