<template>
  <div class="editor">
    <!-- EDITOR Menu -->
    <!-- <input
      style="display: none"
      id="ipt_file"
      type="file"
      onclick="this.value=null"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="onLoadFile($event)"
    /> -->
    <div class="editor__menu">
      <h2 class="editor__title">Docentes</h2>
      <div>
        <!-- <m-btn onclick="ipt_file.click()" color="dark" small class="mr-2">
          <v-icon left small>mdi-file-excel</v-icon>Importar
        </m-btn> -->
        <m-btn @click="showCreate()" color="primary" small>
          <v-icon left small>mdi-plus</v-icon>Crear
        </m-btn>
      </div>
    </div>
    <!-- EDITOR Table -->
    <div class="editor__table mt-4">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Correo</th>
            <th class="text-left">Usuario</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, idx) in entities" :key="idx">
            <td>{{ e.first_name }}</td>
            <td>{{ e.last_name }}</td>
            <td>{{ e.email }}</td>
            <td>{{ e.username }}</td>
            <td class="text-center">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" small icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-0" dense>
                  <v-list-item @click="showEdit(e)">
                    <v-list-item-title>Editar Docente</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="showPassword(e)">
                    <v-list-item-title>Cambiar Contraseña</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="showRemove(e)">
                    <v-list-item-title>Eliminar Docente</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-4" v-show="entities.length === 0">No hay docentes</p>
    </div>

    <!-- DIALOG -->
    <v-dialog v-model="dlg_edit" max-width="600" persistent>
      <form @submit.prevent="save()" class="m-card">
        <div class="m-card__body">
          <h3 v-if="action === 'CREATE'">Crear</h3>
          <h3 v-else>Editar</h3>
          <v-text-field
            v-model="entity.first_name"
            :maxlength="UserModel.first_name.max_length"
            label="Nombres"
            required
            class="mt-4"
          ></v-text-field>
          <v-text-field
            v-model="entity.last_name"
            :maxlength="UserModel.last_name.max_length"
            label="Apellidos"
            required
          ></v-text-field>
          <v-text-field
            v-model="entity.email"
            :maxlength="UserModel.email.max_length"
            label="Correo"
            type="email"
            required
          ></v-text-field>
          <v-text-field
            v-model="entity.username"
            :maxlength="UserModel.username.max_length"
            label="Usuario"
            required
          ></v-text-field>
          <v-text-field
            v-if="action === 'CREATE'"
            v-model="entity.password"
            :maxlength="UserModel.username.max_length"
            label="Contraseña"
            :type="entity.showPassword? 'text': 'password'"
            required
            :append-icon="entity.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="toogleShowPassword(entity)"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            @click="dlg_edit = false"
            color="primary"
            type="button"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn :loading="loading_btn" color="primary" type="submit" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <v-dialog v-model="dlg_remove" width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Desea eliminar?</h3>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" type="button" color="primary" small class="mr-2">Cerrar</m-btn>
          <m-btn @click="remove()" color="error" small>Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>

    <v-dialog v-model="dlg_password" width="400" persistent>
      <form @submit.prevent="savePassword()" class="m-card">
        <div class="m-card__body">
          <v-text-field
            type="password"
            class="text-field"
            v-model="new_password"
            :maxlength="UserModel.password.max_length"
            label="Nueva contraseña"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            class="text-field"
            v-model="confirm_new_password"
            :maxlength="UserModel.password.max_length"
            label="Confirmar nueva contraseña"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            @click="dlg_password = false"
            color="primary"
            type="button"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn
            :loading="loading_btn"
            :disabled="!(new_password.length > 0 && confirm_new_password.length > 0 && new_password === confirm_new_password)"
            color="primary"
            type="submit"
            small
          >Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <v-dialog v-model="dlg_import" width="1200" persistent>
      <div class="import m-card">
        <div class="import__body m-card__body">
          <div class="mt-4">
            <table class="m-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Correo</th>
                  <th>Usuario</th>
                  <th>Contraseña</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entity, idx) in new_data" :key="idx">
                  <td>
                    <v-text-field
                      v-model="entity.first_name"
                      :maxlength="UserModel.first_name.max_length"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="entity.last_name"
                      :maxlength="UserModel.last_name.max_length"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="entity.email"
                      :maxlength="UserModel.email.max_length"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      v-model="entity.username"
                      :maxlength="UserModel.username.max_length"
                      dense
                      hide-details
                      autocomplete="off"
                    ></v-text-field>
                  </td>
                  <td>
                    <v-text-field
                      :type="entity.showPassword? 'text': 'password'"
                      v-model="entity.password"
                      :maxlength="UserModel.password.max_length"
                      dense
                      hide-details
                      autocomplete="off"
                      :append-icon="entity.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      @click:append="toogleShowPassword(entity)"
                    ></v-text-field>
                  </td>
                  <td style="color: red; font-size: 0.8rem">{{ entity.response }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            @click="dlg_import = false"
            color="primary"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <!-- <m-btn @click="saveAll()" :loading="loading_btn" color="primary" small>Guardar</m-btn> -->
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {
  getTeachersBySchool,
  addTeacher,
  updateTeacher,
  removeTeacher,
} from "@/services/teacherService";
import { updatePasswordByAdmin } from "@/services/userService";

// import * as XLSX from "xlsx";

import UserModel from "@/models/User";

export default {
  data: () => ({
    entities: [],
    entity: {},
    UserModel,
    //
    action: "",
    dlg_edit: false,
    loading_btn: false,
    // remove
    username: "",
    dlg_remove: false,
    // password
    new_password: "",
    confirm_new_password: "",
    dlg_password: false,
    // import
    new_data: [],
    dlg_import: false,
  }),
  async created() {
    this.showLoading("Cargando Datos");
    try {
      this.entities = this.mongoArr(await getTeachersBySchool());
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.loading_btn = true;
      try {
        if (this.action === "CREATE") {
          let { _id } = await addTeacher(this.entity);
          this.entity._id = _id;
          this.entities.push(this.entity);
        } else {
          await updateTeacher(this.entity);
          let entity_idx = this.entities.findIndex(
            (entity) => entity._id === this.entity._id
          );
          this.entities[entity_idx] = Object.assign({}, this.entity);
        }
        this.dlg_edit = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    async remove() {
      this.showLoading("Eliminando");
      this.dlg_remove = false;
      try {
        await removeTeacher(this.entity._id);
        this.entities = this.entities.filter((e) => e._id !== this.entity._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async savePassword() {
      if (this.new_password !== this.confirm_new_password) return;

      this.loading_btn = true;
      try {
        await updatePasswordByAdmin(this.entity._id, this.new_password);
        this.dlg_password = false;
        this.showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
    // Import
    // async saveAll() {
    //   this.loading_btn = true;
    //   let i = 0;
    //   while (i < this.new_data.length) {
    //     let entity = this.new_data[i];
    //     entity.classroom_id = this.classroom_id_import;
    //     // entity.pass = generatePassword();
    //     try {
    //       let { _id } = await addTeacher(entity);
    //       entity._id = _id;
    //       this.entities.push(entity);
    //       this.new_data.splice(i, 1);
    //     } catch (error) {
    //       entity.response = error.msg || error;
    //       i++;
    //     }
    //   }
    //   if (this.new_data.length <= 0) this.dlg_import = false;
    //   this.loading_btn = false;
    // },
    // onLoadFile(e) {
    //   let file = e.target.files[0];
    //   if (file) {
    //     let reader = new FileReader();
    //     reader.onload = (e) => {
    //       let file_data = e.target.result;
    //       let excel = XLSX.read(file_data, { type: "binary" });
    //       let names = excel.SheetNames;
    //       let data = XLSX.utils.sheet_to_json(excel.Sheets[names[0]]);
    //       //
    //       if (data.length <= 1000) {
    //         this.new_data = data.map((d) => {
    //           let {
    //             nombres,
    //             apellidos,
    //             usuario,
    //             correo,
    //             Nombres,
    //             Apellidos,
    //             Usuario,
    //             Correo,
    //           } = d;
    //           return {
    //             first_name: nombres || Nombres || "",
    //             last_name: apellidos || Apellidos || "",
    //             email: correo || Correo || "",
    //             username: usuario || Usuario || "",
    //           };
    //         });
    //         this.showImport();
    //       } else {
    //         this.showMessage("", "Error al Importar");
    //       }
    //     };
    //     reader.readAsBinaryString(file);
    //   }
    // },
    //
    toogleShowPassword(e) {
      e.showPassword = !e.showPassword;
      this.$forceUpdate();
    },
    showCreate() {
      this.entity = {};
      this.action = "CREATE";
      this.dlg_edit = true;
    },
    showEdit(e) {
      this.entity = Object.assign({}, e);
      this.action = "EDIT";
      this.dlg_edit = true;
    },
    showRemove(e) {
      this.entity = Object.assign({}, e);
      this.username = "";
      this.dlg_remove = true;
    },
    showPassword(e) {
      this.entity = Object.assign({}, e);
      this.new_password = "";
      this.confirm_new_password = "";
      this.dlg_password = true;
    },
    // showImport() {
    //   this.classroom_id_import = this.classroom_id;
    //   this.dlg_import = true;
    // },
  },
};
</script>

<style lang='scss' scoped>
.editor {
  &__title {
    margin: 0;
  }
  &__menu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
}

.import {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  &__body {
    flex-grow: 1;
    overflow-y: auto;
    padding-top: 0;
  }
}
</style>