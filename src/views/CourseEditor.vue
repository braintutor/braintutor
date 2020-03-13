<template>
  <div class="course-editor container">
    <loading :active="loading" />
    <h1 class="course-editor__title">Configuración</h1>
    <div class="course-editor__content">
      <div class="course-editor__block">
        <span class="course-editor__subtitle">Nombre:</span>
        <v-text-field
          class="course-editor__input"
          v-model="course.name"
          dense
          hide-details
          autocomplete="off"
        ></v-text-field>
      </div>
      <div class="course-editor__block">
        <span class="course-editor__subtitle">Alumnos</span>
        <v-btn rounded small color="success" @click="addStudent()">
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
        :headers="headers"
        :items="students"
        :search="search"
        :loading="loading"
        loading-text="Cargando"
        hide-default-footer
      >
        <template v-slot:item._id="{ item }">
          <v-icon @click="removeStudent(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
      <!-- </div> -->
    </div>
    <div class="course-editor__actions">
      <v-btn color="primary" @click="save()">Guardar</v-btn>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import {
  getCourse,
  updateCourse,
  removeStudent
} from "@/services/courseService.js";
import { getStudent } from "@/services/studentService.js";

export default {
  data: () => ({
    course: {},
    //table
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
    loading: true
  }),
  async mounted() {
    let course_id = getParam("course_id");
    this.course = await getCourse(course_id);

    this.course.id = course_id;
    this.students = await Promise.all(
      this.course.students.map(student => getStudent(student.$oid))
    );
    this.loading = false;
  },
  methods: {
    async save() {
      if (!this.loading) {
        this.loading = true;
        await updateCourse(this.course);
        this.loading = false;
      }
    },
    async removeStudent(student) {
      this.loading = true;

      let student_id = student._id.$oid;
      await removeStudent(this.course.id, student_id);
      this.students = this.students.filter(s => s._id.$oid !== student_id);

      this.loading = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.course-editor {
  $self: &;
  padding: 20px 30px;
  border-radius: 10px;
  @include box-shadow;

  &__title {
    font-size: 1.5rem;
  }
  &__subtitle {
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 16px;
  }
  &__content {
    padding: 16px 0;
    #{$self}__block {
      padding: 16px 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
  }
  &__input {
    font-size: 1.1rem;
  }
  &__actions {
    width: min-content;
    margin: 0 auto;
  }
}
</style>