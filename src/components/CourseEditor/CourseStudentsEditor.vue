<template>
  <div class="pa-5">
    <loading :active="loading" />
    <div class="course-editor__block">
      <h2 class="course-editor__title">Alumnos</h2>
      <v-btn rounded small color="success" @click="dialog = true; searchStudent()">
        Añadir
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <!-- <div class="course-editor__block"> -->
    <!-- <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
    ></v-text-field>-->
    <v-data-table
      class="py-5"
      :headers="headers"
      :items="students"
      :search="search"
      loading-text="Cargando"
      hide-default-footer
    >
      <template v-slot:item._id="{ item }">
        <v-icon @click="removeStudent(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="1000">
      <v-card class="students">
        <form @submit.prevent="searchStudent()" class="students__search">
          <strong class="mt-1 mr-3">Buscar:</strong>
          <v-text-field v-model="new_student_search" hide-details dense autocomplete="off"></v-text-field>
          <v-btn class="ml-3" icon type="submit">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </form>
        <div class="students__loading" v-if="loading_search">
          <v-progress-circular :size="100" :width="4" color="success" indeterminate></v-progress-circular>
        </div>
        <div v-else class="students__list row no-gutters">
          <div
            class="col-6 col-sm-4 col-md-3 pa-2"
            v-for="(student, s_idx) in new_students"
            :key="s_idx"
          >
            <div class="student">
              <p class="student__id">{{student._id.$oid}}</p>
              <p class="student__name">{{student.name}}</p>
              <p class="student__user">{{student.user}}</p>
              <v-btn
                v-if="student.enable"
                @click="addStudent(student)"
                :loading="student.loading"
                color="success"
                small
                block
              >Agregar</v-btn>
              <v-btn v-else depressed small block disabled>Agregado</v-btn>
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import {
  getCourse,
  removeStudent,
  addStudent
} from "@/services/courseService.js";
import { getStudent, getStudents } from "@/services/studentService.js";

export default {
  data: () => ({
    course_id: "",
    search: "",
    headers: [
      {
        text: "Nombre",
        value: "name",
        align: "start"
      },
      {
        text: "Usuario",
        value: "user",
        align: "start"
      },
      {
        text: "Acción",
        value: "_id",
        align: "end"
      }
    ],
    students: [],
    //
    new_student_search: "",
    new_students: [],
    //
    dialog: false,
    loading: true,
    loading_search: false
  }),
  async mounted() {
    this.course_id = getParam("course_id");
    let course = await getCourse(this.course_id);
    this.students = await Promise.all(
      course.students.map(student => getStudent(student.$oid))
    );
    this.loading = false;
  },
  methods: {
    async removeStudent(student) {
      this.loading = true;

      let student_id = student._id.$oid;
      await removeStudent(this.course_id, student_id);
      this.students = this.students.filter(s => s._id.$oid !== student_id);

      this.loading = false;
    },
    async searchStudent() {
      this.loading_search = true;

      let students_idx = this.students.map(student => student._id.$oid); // get enrolled students idx
      let new_students = await getStudents(this.new_student_search); // search students in bd
      new_students.forEach(student => {
        student.enable = !students_idx.includes(student._id.$oid); // enable enrollment button
      });
      this.new_students = new_students;

      this.loading_search = false;
    },
    async addStudent(student) {
      let student_id = student._id.$oid;
      student.loading = true;
      this.$forceUpdate();
      await addStudent(this.course_id, student_id);
      this.students.push(student);
      student.enable = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.students {
  $self: &;
  &__search {
    padding: 10px 20px;
    font-size: 1rem;
    display: flex;
    align-items: center;
    * {
      font-size: 1rem;
    }
  }
  &__loading {
    padding: 48px;
    display: flex;
    justify-content: center;
  }
  &__list {
    overflow-y: auto;
    max-height: 400px;
    padding: 10px;
  }
}
.student {
  padding: 12px;
  border-radius: 10px;
  text-align: center;
  @include box-shadow;
  &__id {
    color: #ccc;
    font-size: 0.8rem;
  }
  &__name {
    font-weight: bold;
    font-size: 1.2rem;
  }
  &__user {
    color: rgb(131, 131, 131);
    font-size: 1rem;
  }
}
</style>