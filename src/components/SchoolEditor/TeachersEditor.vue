<template>
  <div class="teachers-editor">
    <loading :active="loading" />
    <input type="file" onclick="this.value=null" @change="onLoadFile($event)" />
    <div class="teachers-editor__menu">
      <h2 class="teachers-editor__title">Docentes</h2>
      <v-btn rounded small color="success" @click="dialog_edit = true; addTeacher()">
        Añadir
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </div>
    <div class="teachers-editor__content">
      <table class="m-table">
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
    <!--  -->
    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="teacher-edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Docente</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Docente</v-card-title>
        <v-alert v-if="error" type="error" icon="mdi-cloud-alert" text dismissible>{{error}}</v-alert>
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
    <!-- Dialog Import -->
    <v-dialog v-model="dialog_import" max-width="800">
      <v-card class="py-2 px-4">
        <table class="m-table">
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entity, e_idx) in new_data" :key="e_idx">
              <td>{{ entity.first_name }}</td>
              <td>{{ entity.last_name }}</td>
              <td>{{ entity.user }}</td>
            </tr>
          </tbody>
        </table>
        <v-card-actions class="pt-3" style="width: min-content; margin: 0 auto">
          <v-btn small color="primary">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  getTeachersBySchool,
  addTeacher,
  updateTeacher
} from "@/services/teacherService";
import * as XLSX from "xlsx";

export default {
  data: () => ({
    teachers: [],
    teacher: {},
    action: "",
    error: "",
    new_data: [],
    //
    dialog_edit: false,
    dialog_import: false,
    loading: true,
    loading_save: false
  }),
  async mounted() {
    this.teachers = await getTeachersBySchool();
    this.loading = false;
  },
  methods: {
    onLoadFile(e) {
      let file = e.target.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = e => {
          let file_data = e.target.result;
          let excel = XLSX.read(file_data, { type: "binary" });
          let names = excel.SheetNames;
          let data = XLSX.utils.sheet_to_json(excel.Sheets[names[0]]);
          //
          this.new_data = data.map(d => {
            let { nombres, apellidos, usuario } = d;
            return {
              first_name: nombres,
              last_name: apellidos,
              user: usuario
            };
          });
        };
        reader.readAsBinaryString(file);
      }
      this.dialog_import = true;
    },
    toogleShowPassword(teacher) {
      teacher.showPassword = !teacher.showPassword;
      this.$forceUpdate();
    },
    addTeacher() {
      this.action = "create";
      this.error = "";
      this.teacher = {
        first_name: "",
        last_name: "",
        user: "",
        pass: ""
      };
    },
    editTeacher(teacher) {
      this.action = "edit";
      this.error = "";
      this.teacher = Object.assign({}, teacher);
      this.teacher.id = this.teacher._id.$oid;
      this.teacher.showPassword = false;
    },
    async saveTeacher() {
      this.loading_save = true;
      this.error = "";
      if (this.action === "create") {
        let response = await addTeacher(this.teacher);
        if (response.error) {
          this.error = response.error;
        } else {
          this.teacher._id = response._id;
          this.teacher.user = response.user;
          this.teachers.push(this.teacher);
          this.dialog_edit = false;
        }
      } else if (this.action === "edit") {
        let response = await updateTeacher(this.teacher);
        if (response.error) {
          this.error = response.error;
        } else {
          this.teacher.user = response.user;
          let teacher_idx = this.teachers.findIndex(
            teacher => teacher._id.$oid === this.teacher.id
          );
          this.teachers[teacher_idx] = Object.assign({}, this.teacher);
        }
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