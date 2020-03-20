<template>
  <div class="students-editor">
    <loading :active="loading" />
    <h2 class="students-editor__title">Alumnos</h2>
    <div class="students-editor__content">
      <table class="table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Usuario</th>
            <th class="text-left">Contraseña</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, s_idx) in students" :key="s_idx">
            <td>{{ student.first_name }}</td>
            <td>{{ student.last_name }}</td>
            <td>{{ student.user }}</td>
            <td>
              <v-btn class="mr-2" small icon @click="toogleShowPassword(student)">
                <v-icon v-if="student.showPassword">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
              <span v-if="student.showPassword">{{ student.pass }}</span>
              <span v-else>******</span>
            </td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; editStudent(student)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="student-edit">
        <v-card-title class="py-5">Editar Alumno</v-card-title>
        <v-card-text class="student-edit__content">
          <span class="mt-1 mr-4">Nombres:</span>
          <v-text-field
            class="text-field"
            v-model="student.first_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Apellidos:</span>
          <v-text-field
            class="text-field"
            v-model="student.last_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Usuario:</span>
          <v-text-field
            class="text-field"
            v-model="student.user"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Contraseña:</span>
          <v-text-field
            class="text-field"
            v-model="student.pass"
            :append-icon="student.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            dense
            hide-details
            autocomplete="off"
            :type="student.showPassword ? 'text' : 'password'"
            @click:append="toogleShowPassword(student)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="student-edit__actions">
          <v-btn color="primary" :loading="loading_save" @click="saveStudent()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSchool } from "@/services/schoolService";
import { getStudents, updateStudent } from "@/services/studentService";

export default {
  data: () => ({
    school_id: "",
    students: [],
    student: {},
    //
    dialog_edit: false,
    loading: true,
    loading_save: false
  }),
  async mounted() {
    let school = await getSchool();
    this.school_id = school._id.$oid;
    this.students = await getStudents(this.school_id);
    this.loading = false;
  },
  methods: {
    toogleShowPassword(student) {
      student.showPassword = !student.showPassword;
      this.$forceUpdate();
    },
    editStudent(student) {
      this.student = Object.assign({}, student);
      this.student.id = this.student._id.$oid;
      this.student.showPassword = false;
    },
    async saveStudent() {
      this.loading_save = true;
      await updateStudent(this.student);
      let student_idx = this.students.findIndex(
        student => student._id.$oid === this.student.id
      );
      this.students[student_idx] = Object.assign({}, this.student);
      this.loading_save = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.students-editor {
  padding: 10px 16px;
  &__title {
    margin-bottom: 10px;
  }
  &__content {
    overflow-x: auto;
  }
}

.table {
  width: 100%;
  thead {
    tr {
      th {
        padding: 8px 10px 8px 0;
        font-size: 1.1rem;
      }
    }
  }
  tbody {
    tr {
      td {
        padding: 4px 0;
        font-size: 1rem;
      }
    }
  }
}

.student-edit {
  &__content {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-row-gap: 20px;
    & * {
      font-size: 1rem;
    }
  }
  &__actions {
    padding: 20px;
    padding-top: 0;
    display: flex;
    justify-content: center;
  }
}
</style>