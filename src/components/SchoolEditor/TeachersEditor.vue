<template>
  <div class="teachers-editor">
    <loading :active="loading" />
    <div class="teachers-editor__menu">
      <h2 class="teachers-editor__title">Docentes</h2>
      <v-btn rounded small color="success" @click="dialog_edit = true; addTeacher()">
        Añadir
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="teachers-editor__content">
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
          <tr v-for="(teacher, s_idx) in teachers" :key="s_idx">
            <td>{{ teacher.first_name }}</td>
            <td>{{ teacher.last_name }}</td>
            <td>{{ teacher.user }}</td>
            <td>
              <v-btn class="mr-2" small icon @click="toogleShowPassword(teacher)">
                <v-icon v-if="teacher.showPassword">mdi-eye</v-icon>
                <v-icon v-else>mdi-eye-off</v-icon>
              </v-btn>
              <span v-if="teacher.showPassword">{{ teacher.pass }}</span>
              <span v-else>******</span>
            </td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; editTeacher(teacher)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="teacher-edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Docente</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Docente</v-card-title>
        <v-card-text class="teacher-edit__content">
          <span class="mt-1 mr-4">Nombres:</span>
          <v-text-field
            class="text-field"
            v-model="teacher.first_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Apellidos:</span>
          <v-text-field
            class="text-field"
            v-model="teacher.last_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Usuario:</span>
          <v-text-field
            class="text-field"
            v-model="teacher.user"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Contraseña:</span>
          <v-text-field
            class="text-field"
            v-model="teacher.pass"
            :append-icon="teacher.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            dense
            hide-details
            autocomplete="off"
            :type="teacher.showPassword ? 'text' : 'password'"
            @click:append="toogleShowPassword(teacher)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="teacher-edit__actions">
          <v-btn color="primary" :loading="loading_save" @click="saveTeacher()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  getTeachers,
  addTeacher,
  updateTeacher
} from "@/services/teacherService";

export default {
  data: () => ({
    teachers: [],
    teacher: {},
    action: "",
    //
    dialog_edit: false,
    loading: true,
    loading_save: false
  }),
  async mounted() {
    this.teachers = await getTeachers();
    this.loading = false;
  },
  methods: {
    toogleShowPassword(teacher) {
      teacher.showPassword = !teacher.showPassword;
      this.$forceUpdate();
    },
    addTeacher() {
      this.action = "create";
      this.teacher = {
        first_name: "",
        last_name: "",
        user: "",
        pass: ""
      };
    },
    editTeacher(teacher) {
      this.action = "edit";
      this.teacher = Object.assign({}, teacher);
      this.teacher.id = this.teacher._id.$oid;
      this.teacher.showPassword = false;
    },
    async saveTeacher() {
      this.loading_save = true;
      if (this.action === "create") {
        let teacher_id = await addTeacher(this.teacher);
        this.teacher._id = teacher_id;
        this.teachers.push(this.teacher);
        this.dialog_edit = false;
      } else if (this.action === "edit") {
        await updateTeacher(this.teacher);
        let teacher_idx = this.teachers.findIndex(
          teacher => teacher._id.$oid === this.teacher.id
        );
        this.teachers[teacher_idx] = Object.assign({}, this.teacher);
      }
      this.loading_save = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.teachers-editor {
  padding: 10px 16px;
  &__menu {
    display: flex;
    justify-content: space-between;
  }
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

.teacher-edit {
  &__content {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-row-gap: 20px;
    align-items: center;
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