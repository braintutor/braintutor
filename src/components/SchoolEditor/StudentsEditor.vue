<template>
  <div class="students-editor">
    <loading :active="loading" />
    <h2 class="students-editor__title">Alumnos</h2>
    <table class="table">
      <thead>
        <tr>
          <th class="text-left">Nombre</th>
          <th class="text-left">Usuario</th>
          <th class="text-left">Contraseña</th>
          <th class="text-left">Acción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, s_idx) in students" :key="s_idx">
          <td>{{ student.name }}</td>
          <td>{{ student.user }}</td>
          <td>
            <v-btn class="mr-2" x-small icon @click="toogleShowPassword(student)">
              <v-icon v-if="student.showPassword">mdi-eye</v-icon>
              <v-icon v-else>mdi-eye-off</v-icon>
            </v-btn>
            <span v-if="student.showPassword">{{ student.pass }}</span>
            <span v-else>*****</span>
          </td>
          <td>
            <v-btn small icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSchool } from "@/services/schoolService";
import { getStudents } from "@/services/studentService";

export default {
  data: () => ({
    school_id: "",
    students: [],
    //
    loading: true
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
}

.table {
  width: 100%;
  thead {
    tr {
      th {
        padding: 8px 0;
        font-size: 1.1rem;
      }
    }
  }
  tbody {
    tr {
      td {
        font-size: 0.9rem;
      }
    }
  }
}
</style>