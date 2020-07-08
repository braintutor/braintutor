<template>
  <div class="editor">
    <loading :active="loading" :message="loading_msg" />
    <input
      style="display: none"
      id="ipt_file"
      type="file"
      onclick="this.value=null"
      @change="onLoadFile($event)"
    />
    <div class="editor__menu">
      <h2 class="editor__title">Alumnos</h2>
      <div class="editor__actions">
        <v-btn class="mr-3" rounded small color="warning" onclick="ipt_file.click()">
          Importar
          <v-icon right>mdi-file-excel</v-icon>
        </v-btn>
        <v-btn rounded small color="success" @click="dlg_edit = true; add()">
          Añadir
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="editor__filter">
      <h3 class="mr-5">Aula:</h3>
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-text="name"
        item-value="_id"
        dense
        solo
      ></v-select>
    </div>
    <v-divider class="mt-5 mb-4"></v-divider>
    <div class="editor__content">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Correo</th>
            <th class="text-left">Usuario</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(e, e_idx) in entities_filtered" :key="e_idx">
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
                  <v-list-item @click="dlg_edit = true; edit(e)">
                    <v-list-item-title>Editar Alumno</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="new_password = ''; confirm_new_password = ''; dlg_password = true; entity = e"
                  >
                    <v-list-item-title>Cambiar Contraseña</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    @click="entity = e; entity_username_remove = ''; dialog_remove = true"
                  >
                    <v-list-item-title>Eliminar Alumno</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="entities_filtered.length === 0">No hay alumnos</p>
    </div>

    <!-- CREATE | EDIT -->
    <v-dialog v-model="dlg_edit" class="container" max-width="500" persistent>
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear Alumno</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar Alumno</v-card-title>
        <v-card-text class="edit__content">
          <span class="mt-1 mr-4">Nombres:</span>
          <v-text-field
            class="text-field"
            v-model="entity.first_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Apellidos:</span>
          <v-text-field
            class="text-field"
            v-model="entity.last_name"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Correo:</span>
          <v-text-field
            class="text-field"
            v-model="entity.email"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4">Aula:</span>
          <v-select
            v-model="entity.classroom_id"
            :items="classrooms"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
          <span class="mt-1 mr-4">Usuario:</span>
          <v-text-field
            class="text-field"
            v-model="entity.username"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span class="mt-1 mr-4" v-if="action === 'create'">Contraseña:</span>
          <v-text-field
            v-if="action === 'create'"
            class="text-field"
            :type="entity.showPassword? 'text': 'password'"
            v-model="entity.password"
            dense
            hide-details
            autocomplete="off"
            :append-icon="entity.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="toogleShowPassword(entity)"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="edit__actions">
          <v-btn v-if="!loading_save" @click="dlg_edit = false" small text>Cerrar</v-btn>
          <v-btn color="primary" :loading="loading_save" @click="save()" small depressed>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOG REMOVE -->
    <v-dialog v-model="dialog_remove" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title class="py-5">Eliminar</v-card-title>
        <v-card-text>
          <p>Es posible que el alumno tenga evaluaciones guardadas. ¿Desea Continuar?</p>
          <p>Escriba el usuario a eliminar:</p>
          <v-text-field
            class="text-field"
            v-model="entity_username_remove"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="edit__actions">
          <v-btn text @click="dialog_remove = false" small>Cancelar</v-btn>
          <v-btn color="error" :loading="loading_save" @click="remove()" small>Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- DIALOG IMPORT -->
    <v-dialog v-model="dialog_import" persistent max-width="900">
      <v-card class="py-2 px-4">
        <div class="editor__filter mt-1 mb-5">
          <h3 class="mr-5">Aula:</h3>
          <v-select
            v-model="classroom_id_import"
            :items="classrooms"
            item-text="name"
            item-value="_id"
            dense
            solo
          ></v-select>
        </div>
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
                  class="text-field"
                  v-model="entity.first_name"
                  dense
                  hide-details
                  autocomplete="off"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  class="text-field"
                  v-model="entity.last_name"
                  dense
                  hide-details
                  autocomplete="off"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  class="text-field"
                  v-model="entity.email"
                  dense
                  hide-details
                  autocomplete="off"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  class="text-field"
                  v-model="entity.username"
                  dense
                  hide-details
                  autocomplete="off"
                ></v-text-field>
              </td>
              <td>
                <v-text-field
                  class="text-field"
                  :type="entity.showPassword? 'text': 'password'"
                  v-model="entity.password"
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
        <v-card-actions class="pt-3" style="width: min-content; margin: 0 auto">
          <v-btn
            small
            text
            class="mr-3"
            :loading="loading_save"
            @click="dialog_import = false"
          >Cerrar</v-btn>
          <v-btn small color="primary" :loading="loading_save" @click="saveAll()">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Password -->
    <v-dialog v-model="dlg_password" max-width="400" persistent>
      <v-card>
        <v-card-title>Cambiar Contraseña</v-card-title>
        <v-card-text>
          <div class="mt-3">
            <span>Nueva contraseña</span>
            <v-text-field
              type="password"
              class="text-field"
              v-model="new_password"
              dense
              hide-details
            ></v-text-field>
          </div>
          <div class="mt-5">
            <span>Confirmar nueva contraseña</span>
            <v-text-field
              type="password"
              class="text-field"
              v-model="confirm_new_password"
              dense
              hide-details
            ></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dlg_password = false" small text>Cerrar</v-btn>
          <v-btn @click="savePassword()" color="primary" small depressed>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import {
  getStudents,
  addStudent,
  updateStudent,
  removeStudent
} from "@/services/studentService";
// import { generatePassword } from "@/services/userService";
import { getClassroomsBySchool } from "@/services/classroomService";
import { updatePasswordByAdmin } from "@/services/userService";

import * as XLSX from "xlsx";

export default {
  data: () => ({
    entities: [],
    entity: {},
    classrooms: [],
    classroom_id: "",
    classroom_id_import: "",
    action: "",
    new_data: [],
    //
    dlg_edit: false,
    dialog_import: false,
    loading: true,
    loading_save: false,
    loading_msg: "",
    // Remove
    entity_username_remove: "",
    dialog_remove: false,
    // Change Password
    new_password: "",
    confirm_new_password: "",
    dlg_password: false
  }),
  async mounted() {
    this.loading_msg = "Cagando Alumnos";
    this.entities = await getStudents();
    this.loading_msg = "Cargando Aulas";
    this.classrooms = await getClassroomsBySchool();
    if (this.classrooms.length !== 0) {
      this.classrooms.sort((a, b) => a.name.localeCompare(b.name));
      this.classroom_id = this.classrooms[0]._id;
      this.classroom_id_import = this.classrooms[0]._id;
    } else {
      this.$root.$children[0].showMessage(
        "Alerta",
        "No puede crear alumnos sino hay aulas existentes."
      );
    }
    this.loading = false;
  },
  computed: {
    entities_filtered() {
      let entities = this.entities.filter(
        e => e.classroom_id.$oid === this.classroom_id.$oid
      );
      return entities;
    }
  },
  methods: {
    toogleShowPassword(entity) {
      entity.showPassword = !entity.showPassword;
      this.$forceUpdate();
    },
    add() {
      this.action = "create";
      this.entity = {};
    },
    edit(entity) {
      this.action = "edit";
      this.entity = Object.assign({}, entity);
      this.entity.id = this.entity._id.$oid;
      this.entity.showPassword = false;
    },
    async save() {
      this.loading_save = true;
      if (this.action === "create") {
        try {
          // this.entity.pass = generatePassword();
          let entity_id = await addStudent(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dlg_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        try {
          await updateStudent(this.entity);
          let entity_idx = this.entities.findIndex(
            entity => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = Object.assign({}, this.entity);
          this.entities.splice();
          this.dlg_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading_save = false;
    },
    async savePassword() {
      if (this.new_password !== this.confirm_new_password) {
        this.$root.$children[0].showMessage(
          "",
          "Las contraseñas no coinciden."
        );
        return;
      }

      this.dlg_password = false;
      this.loading = true;
      this.loading_msg = "Cambiando Contraseña";

      try {
        await updatePasswordByAdmin(this.entity._id.$oid, this.new_password);
        this.$root.$children[0].showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando Alumno";
      this.dialog_remove = false;

      try {
        await removeStudent(this.entity._id.$oid, this.entity_username_remove);
        this.entities = this.entities.filter(
          e => e._id.$oid !== this.entity._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }
      this.loading = false;
    },
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
          if (data.length <= 1000) {
            this.new_data = data.map(d => {
              let {
                nombres,
                apellidos,
                usuario,
                correo,
                Nombres,
                Apellidos,
                Usuario,
                Correo
              } = d;
              return {
                first_name: nombres || Nombres || "",
                last_name: apellidos || Apellidos || "",
                email: correo || Correo || "",
                username: usuario || Usuario || ""
              };
            });
            this.dialog_import = true;
          } else {
            this.$root.$children[0].showMessage("Error al Importar", "");
          }
        };
        reader.readAsBinaryString(file);
      }
    },
    async saveAll() {
      this.loading_save = true;
      let i = 0;
      while (i < this.new_data.length) {
        let entity = this.new_data[i];
        entity.classroom_id = this.classroom_id_import;
        // entity.pass = generatePassword();
        try {
          let entity_id = await addStudent(entity);
          entity._id = entity_id;
          this.entities.push(entity);
          this.new_data.splice(i, 1);
        } catch (error) {
          entity.response = error.msg;
          i++;
        }
      }
      if (this.new_data.length <= 0) this.dialog_import = false;
      this.loading_save = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.editor {
  padding: 10px 16px;
  &__menu {
    margin-bottom: 12px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__filter {
    display: flex;
    align-items: center;
  }
  &__title {
    margin-bottom: 6px;
  }
  &__content {
    overflow-x: auto;
  }
  &__message {
    margin: 10px 0;
    font-weight: lighter;
    font-size: 1.1rem;
    text-align: center;
  }
}

.edit {
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