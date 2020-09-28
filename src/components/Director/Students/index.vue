<template>
  <div class="m-container">
    <div v-show="!student_selected">
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
      <div v-show="!classroom_id" class="text-center mt-4">
        Seleccione un Aula
      </div>
      <!-- Students -->
      <div v-show="classroom_id">
        <div class="m-table mt-4">
          <table>
            <thead>
              <tr>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Usuario</th>
                <th>Correo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(student, idx) in students" :key="idx">
                <td>{{ student.first_name }}</td>
                <td>{{ student.last_name }}</td>
                <td>{{ student.username }}</td>
                <td>{{ student.email }}</td>
                <!-- <td>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-bind="attrs" v-on="on" small icon>
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item @click="student_selected = student">
                        <v-list-item-title>Ver Más</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student -->
    <div v-if="student_selected">
      <div class="m-menu">
        <div class="m-menu__left">
          <v-btn small icon @click="student_selected = null">
            <v-icon style="font-size: 1.5rem">mdi-arrow-left</v-icon>
          </v-btn>
        </div>
      </div>
      <Student :student="student_selected" />
    </div>
  </div>
</template>

<script>
import Student from "./Student";

export default {
  data: () => ({
    classroom_id: null,
    classrooms: [],
    students: [],
    student_selected: null,
  }),
  watch: {
    async classroom_id() {
      await this.getStudents();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Aulas");
      try {
        this.classrooms = this.mongoArr(await this.$api.classroom.getAll());
        this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async getStudents() {
      if (!this.classroom_id) return;

      this.showLoading("Cargando Alumnos");
      try {
        this.students = this.mongoArr(await this.$api.student.getAll(this.classroom_id));
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
@import "@/styles/filters";
</style>