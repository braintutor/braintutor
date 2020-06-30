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
      <h2 class="editor__title">Docentes</h2>
      <div class="editor__actions">
        <v-btn class="mr-3" rounded small color="warning" onclick="ipt_file.click()">
          Importar
          <v-icon right>mdi-file-excel</v-icon>
        </v-btn>
        <v-btn rounded small color="success" @click="dialog_edit = true; add()">
          Añadir
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="editor__content">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Correo</th>
            <th class="text-left">Usuario</th>
            <!-- <th class="text-left">Contraseña</th> -->
            <th class="text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entity, idx) in entities" :key="idx">
            <td>{{ entity.first_name }}</td>
            <td>{{ entity.last_name }}</td>
            <td>{{ entity.email }}</td>
            <td>{{ entity.username }}</td>
            <td class="text-center">
              <v-btn small icon @click="dialog_edit = true; edit(entity)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </table>
      <p class="text-center mt-2" v-show="entities.length === 0">No hay docentes.</p>
    </div>
    <!-- CREATE || EDIT -->
    <v-dialog v-model="dialog_edit" class="container" max-width="500">
      <v-card class="edit">
        <v-card-title v-if="action === 'create'" class="py-5">Crear</v-card-title>
        <v-card-title v-else-if="action === 'edit'" class="py-5">Editar</v-card-title>
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
          <span class="mt-1 mr-4">Usuario:</span>
          <v-text-field
            class="text-field"
            v-model="entity.username"
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <span v-if="action === 'create'" class="mt-1 mr-4">Contraseña:</span>
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
          <v-btn
            v-if="action === 'edit'"
            color="error"
            :loading="loading_save"
            @click="dialog_remove = true"
            small
          >Eliminar</v-btn>
          <v-btn color="primary" :loading="loading_save" @click="save()" small>Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Dialog Import -->
    <v-dialog v-model="dialog_import" persistent max-width="900">
      <v-card class="py-2 px-4">
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
    <!-- Dialog Remove -->
    <v-dialog v-model="dialog_remove" persistent max-width="300">
      <v-card class="edit">
        <div class="py-5 text-center">¿Desea eliminar?</div>
        <v-card-actions class="edit__actions">
          <v-btn @click="dialog_remove = false" small text>Cancelar</v-btn>
          <v-btn @click="remove(); dialog_remove = false" color="error" small>Eliminar</v-btn>
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
  updateTeacher,
  removeTeacher
} from "@/services/teacherService";
// import { generatePassword } from "@/services/userService";
import * as XLSX from "xlsx";

export default {
  data: () => ({
    entities: [],
    entity: {},
    action: "",
    new_data: [],
    //
    dialog_edit: false,
    dialog_import: false,
    dialog_remove: false,
    loading: true,
    loading_msg: "",
    loading_save: false
  }),
  async mounted() {
    this.loading_msg = "Cargando Docentes";
    this.entities = await getTeachersBySchool();
    this.loading = false;
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
          let entity_id = await addTeacher(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      } else if (this.action === "edit") {
        try {
          await updateTeacher(this.entity);
          let entity_idx = this.entities.findIndex(
            entity => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = Object.assign({}, this.entity);
          this.dialog_edit = false;
        } catch (error) {
          this.$root.$children[0].showMessage("Error al Guardar", error.msg);
        }
      }
      this.loading_save = false;
    },
    async remove() {
      this.loading = true;
      this.loading_msg = "Eliminando Docente";
      this.dialog_edit = false;
      try {
        await removeTeacher(this.entity._id.$oid);
        this.entities = this.entities.filter(
          e => e._id.$oid !== this.entity._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("Error al Eliminar", error.msg);
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
                user: usuario || Usuario || ""
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
        // entity.pass = generatePassword();
        try {
          let entity_id = await addTeacher(entity);
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
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  &__title {
    margin-bottom: 6px;
  }
  &__content {
    overflow-x: auto;
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