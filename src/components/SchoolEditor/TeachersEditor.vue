<template>
  <div class="editor">
    <!-- EDITOR Menu -->
    <input
      style="display: none"
      id="ipt_file"
      type="file"
      onclick="this.value=null"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      @change="onLoadFile($event)"
    />
    <div class="editor__menu">
      <h2 class="editor__title">Docentes</h2>
      <div>
        <m-btn onclick="ipt_file.click()" color="dark" small class="mr-2">
          <v-icon left small>mdi-file-excel</v-icon>Importar
        </m-btn>
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
      <p class="text-center mt-4" v-show="entities.length === 0">
        No hay docentes
      </p>
    </div>
    <!-- DIALOG -->
    <v-dialog v-model="dlg_edit" max-width="600" persistent>
      <form @submit.prevent="save()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3 v-if="action === 'CREATE'">Crear</h3>
            <h3 v-else>Editar</h3>
            <v-btn class="mx-2" icon small @click="dlg_edit = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
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
            :type="entity.showPassword ? 'text' : 'password'"
            required
            :append-icon="entity.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="toogleShowPassword(entity)"
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_btn"
            @click="dlg_edit = false"
            type="button"
            small
            text
            class="cancel-button"
            >Cerrar</m-btn
          >
          <m-btn :loading="loading_btn" color="primary" type="submit" small
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <v-dialog v-model="dlg_remove" width="400">
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>¿Desea eliminar?</h3>
            <v-btn class="mx-2" icon small @click="dlg_remove = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_remove = false"
            type="button"
            small
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn @click="remove()" color="error" small>Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
    <v-dialog v-model="dlg_password" width="400" persistent>
      <form @submit.prevent="savePassword()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Cambiar contraseña</h3>
            <v-btn class="mx-2" icon small @click="dlg_password = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
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
            type="button"
            small
            text
            class="cancel-button"
            >Cancelar</m-btn
          >
          <m-btn
            :loading="loading_btn"
            :disabled="
              !(
                new_password.length > 0 &&
                confirm_new_password.length > 0 &&
                new_password === confirm_new_password
              )
            "
            color="primary"
            type="submit"
            small
            >Guardar</m-btn
          >
        </div>
      </form>
    </v-dialog>
    <v-dialog v-model="dlg_import" width="1600" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <div></div>
            <v-btn class="mx-2" icon small @click="dlg_import = false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <div v-if="!is_first_import" class="mb-4">
            <div style="display: flex">
              <h3>Usuarios Creados</h3>
              <m-btn
                @click="exportExcel(import_success, 'success')"
                color="primary"
                type="submit"
                small
                text
                class="ml-3 pa-1"
              >
                <v-icon style="font-size: 1.2rem">mdi-download</v-icon>
              </m-btn>
            </div>
            <div class="mt-3 py-2 px-3" style="border: 1px solid #ccc">
              <table class="m-table">
                <thead>
                  <tr>
                    <th class="text-left">Nombres</th>
                    <th class="text-left">Apellidos</th>
                    <th class="text-left">Correo</th>
                    <th class="text-left">Usuario</th>
                    <th class="text-left">
                      <span>Contraseña</span>
                      <v-btn
                        class="ml-1"
                        @click="
                          show_passwords_success = !show_passwords_success
                        "
                        icon
                      >
                        <v-icon style="font-size: 1.3rem">{{
                          show_passwords_success ? "mdi-eye" : "mdi-eye-off"
                        }}</v-icon>
                      </v-btn>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entity, idx) in import_success" :key="idx">
                    <td class="px-1">
                      <span>{{ entity.first_name }}</span>
                    </td>
                    <td class="px-1">
                      <span>{{ entity.last_name }}</span>
                    </td>
                    <td class="px-1">
                      <span>{{ entity.email }}</span>
                    </td>
                    <td class="px-1">
                      <span>{{ entity.username }}</span>
                    </td>
                    <td class="px-1">
                      <span v-if="show_passwords_success">{{
                        entity.password
                      }}</span>
                      <span v-else>******</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="import_success.length <= 0" class="text-center mt-2">
                No hay información
              </p>
            </div>
          </div>
          <div>
            <div>
              <div style="display: flex">
                <h3 v-if="is_first_import">Nuevos Usuarios</h3>
                <h3 v-else>Errores</h3>
                <m-btn
                  @click="exportExcel(new_data, 'errors')"
                  color="primary"
                  type="submit"
                  small
                  text
                  class="ml-3 pa-1"
                >
                  <v-icon style="font-size: 1.2rem">mdi-download</v-icon>
                </m-btn>
              </div>
              <!-- <ul class="mt-2">
                <li>Verifique que el nombre de usuario no esté en uso</li>
              </ul> -->
            </div>
            <v-form
              ref="form_import"
              @submit.prevent="saveAll()"
              class="mt-3 py-2 px-3"
              style="border: 1px solid #ccc"
            >
              <table class="m-table">
                <thead>
                  <tr>
                    <th class="text-left">Nombres</th>
                    <th class="text-left">Apellidos</th>
                    <th class="text-left">Correo</th>
                    <th class="text-left">Usuario</th>
                    <th class="text-left">
                      <span>Contraseña</span>
                      <v-btn
                        class="ml-1"
                        @click="show_passwords_errors = !show_passwords_errors"
                        icon
                      >
                        <v-icon style="font-size: 1.3rem">{{
                          show_passwords_errors ? "mdi-eye" : "mdi-eye-off"
                        }}</v-icon>
                      </v-btn>
                    </th>
                    <th v-if="!is_first_import">Observación</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(entity, idx) in new_data" :key="idx">
                    <td class="px-1">
                      <v-text-field
                        v-model="entity.first_name"
                        :rules="nameRules"
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </td>
                    <td class="px-1">
                      <v-text-field
                        v-model="entity.last_name"
                        :rules="nameRules"
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </td>
                    <td class="px-1">
                      <v-text-field
                        v-model="entity.email"
                        :rules="emailRules"
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </td>
                    <td class="px-1">
                      <v-text-field
                        v-model="entity.username"
                        :rules="usernameRules"
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </td>
                    <td class="px-1">
                      <v-text-field
                        v-model="entity.password"
                        :rules="passwordRules"
                        :type="show_passwords_errors ? 'text' : 'password'"
                        dense
                        autocomplete="off"
                      ></v-text-field>
                    </td>
                    <td
                      v-if="!is_first_import"
                      class="text-center"
                      style="font-size: 0.8rem"
                    >
                      {{ entity.error }}
                    </td>
                    <td>
                      <v-btn class="mb-2" @click="new_data.splice(idx, 1)" icon>
                        <v-icon style="font-size: 1.3rem">mdi-close</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="new_data.length <= 0" class="text-center mt-2">
                No hay información
              </p>
              <div
                style="display: flex; justify-content: flex-end"
                class="mt-3"
              >
                <m-btn
                  type="button"
                  @click="generatePasswords()"
                  color="dark"
                  text
                  small
                >
                  <v-icon style="font-size: 1.1rem" class="mr-2"
                    >mdi-lock-reset</v-icon
                  ><span>Generar Contraseñas</span></m-btn
                >
                <m-btn
                  type="button"
                  @click="new_data.push({})"
                  color="dark"
                  text
                  small
                  class="ml-2"
                >
                  <v-icon style="font-size: 1.1rem" class="mr-2"
                    >mdi-plus</v-icon
                  >
                  <span>Añadir Usuario</span>
                </m-btn>
              </div>
              <div
                v-if="new_data.length > 0"
                style="display: flex; justify-content: flex-end"
                class="mt-3"
              >
                <m-btn
                  @click="dlg_import = false"
                  type="button"
                  color="primary"
                  small
                  text
                  >Cerrar</m-btn
                >
                <m-btn type="submit" color="primary" small class="ml-2"
                  >Guardar</m-btn
                >
              </div>
            </v-form>
          </div>
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
import { exportExcel } from "@/services/excel";
import * as XLSX from "xlsx";
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
    nameRules: [
      (v) => !!v || "Nombre requerido",
      (v) => /^[a-zA-ZÀ-ÿ\s]+$/.test(v) || "Nombre inválido",
    ],
    emailRules: [
      (v) => !!v || "Correo requerido",
      (v) => /^[^@]+@[^@]+\.[^@]+$/.test(v) || "Correo inválido",
    ],
    usernameRules: [
      (v) => !!v || "Nombre de usuario requerido",
      (v) => /^[a-z][a-zñ0-9._@]*$/.test(v) || "Nombre de usuario inválido",
    ],
    passwordRules: [
      (v) => !!v || "Contraseña requerida",
      (v) => /^\S+$/.test(v) || "Contraseña inválida",
    ],
    show_passwords_success: false,
    show_passwords_errors: false,
    import_success: [],
    is_first_import: true,
    dlg_import: false,
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Datos");
      try {
        this.entities = this.mongoArr(await getTeachersBySchool());
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
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
    onLoadFile(e) {
      let file = e.target.files[0];
      this.new_data = [];
      this.import_success = [];
      this.is_first_import = true;
      if (!file) return;

      let reader = new FileReader();
      reader.onload = (e) => {
        let file_data = e.target.result;
        let excel = XLSX.read(file_data, { type: "binary" });
        let names = excel.SheetNames;
        let data = XLSX.utils.sheet_to_json(excel.Sheets[names[0]]);
        //
        if (data.length <= 1000) {
          this.new_data = data.map((d) => {
            let {
              nombres,
              apellidos,
              usuario,
              correo,
              contraseña,
              Nombres,
              Apellidos,
              Usuario,
              Correo,
              Contraseña,
            } = d;
            return {
              first_name: nombres || Nombres || "",
              last_name: apellidos || Apellidos || "",
              email: correo || Correo || "",
              username: usuario || Usuario || "",
              password: contraseña || Contraseña || "",
            };
          });
          this.dlg_import = true;
        } else {
          this.showMessage("", "Error al Importar");
        }
      };
      reader.readAsBinaryString(file);
    },
    async saveAll() {
      if (this.new_data.length <= 0) return;
      if (!this.$refs.form_import.validate()) return;

      this.dlg_import = false;
      this.showLoading("Guardando");
      try {
        let users = this.new_data.map((user) => ({
          ...user,
          password: user.password + "",
        }));
        let { success, errors } = await this.$api.teacher.createMassive({
          users,
        });
        await this.init();
        this.import_success = this.import_success.concat(success);
        this.new_data = errors;
        this.dlg_import = true;
        this.is_first_import = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    exportExcel,
    generatePasswords() {
      this.new_data = this.new_data.map((item) => ({
        ...item,
        password: this.generatePassword(),
      }));
    },
    generatePassword() {
      return Math.random().toString(36).slice(-8);
    },
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

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}
</style>