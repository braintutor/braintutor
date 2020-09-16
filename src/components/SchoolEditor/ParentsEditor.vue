<template>
  <div class="entities">
    <div class="entities__menu">
      <h2 class="entities__title">Padres</h2>
      <m-btn @click="showCreate()" color="primary" small>
        <v-icon small class="mr-2">mdi-plus</v-icon>Crear
      </m-btn>
    </div>

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
          <td>{{e.first_name}}</td>
          <td>{{e.last_name}}</td>
          <td>{{e.email}}</td>
          <td>{{e.username}}</td>
          <td class="text-center">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" small icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list class="pa-0" dense>
                <v-list-item @click="showEdit(e)">
                  <v-list-item-title>Editar Usuario</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showPassword(e)">
                  <v-list-item-title>Cambiar Contraseña</v-list-item-title>
                </v-list-item>
                <v-list-item @click="showRemove(e)">
                  <v-list-item-title>Eliminar Usuario</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </td>
        </tr>
      </tbody>
    </table>

    <v-dialog v-model="dlg_new" width="400" persistent>
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
            type="password"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            v-if="!loading_save"
            @click="dlg_new = false"
            color="primary"
            type="button"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn :loading="loading_save" color="primary" type="submit" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <v-dialog v-model="dlg_remove" width="400" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <h3>¿Desea eliminar?</h3>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small class="mr-2">Cerrar</m-btn>
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
            @click="dlg_password = false"
            color="primary"
            type="button"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn color="primary" type="submit" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>
  </div>
</template>

<script>
import {
  getParents,
  addParent,
  updateParent,
  removeParent,
} from "@/services/parentService";
import { updatePasswordByAdmin } from "@/services/userService";

import UserModel from "@/models/User";

export default {
  data: () => ({
    entity: {},
    entities: [],
    action: "",
    //
    loading_save: false,
    dlg_new: false,
    dlg_remove: false,
    dlg_password: false,
    //
    new_password: "",
    confirm_new_password: "",
    UserModel,
  }),
  async created() {
    this.showLoading("Cargando Datos");
    try {
      this.entities = await getParents();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.loading_save = true;
      try {
        if (this.action === "CREATE") {
          let entity_id = await addParent(this.entity);
          this.entity._id = entity_id;
          this.entities.push(this.entity);
        } else {
          this.entity.id = this.entity._id.$oid;
          await updateParent(this.entity);
          let entity_idx = this.entities.findIndex(
            (entity) => entity._id.$oid === this.entity.id
          );
          this.entities[entity_idx] = Object.assign({}, this.entity);
        }
        this.dlg_new = false;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_save = false;
    },
    async remove() {
      this.showLoading("Eliminando");
      this.dlg_remove = false;
      try {
        await removeParent(this.entity._id.$oid);
        this.entities = this.entities.filter(
          (e) => e._id.$oid !== this.entity._id.$oid
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async savePassword() {
      if (this.new_password !== this.confirm_new_password) {
        this.showMessage("", "Las contraseñas no coinciden.");
        return;
      }

      this.showLoading("Guardando Cambios");
      this.dlg_password = false;
      try {
        await updatePasswordByAdmin(this.entity._id.$oid, this.new_password);
        this.showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    showCreate() {
      this.entity = {};
      this.action = "CREATE";
      this.dlg_new = true;
    },
    showEdit(e) {
      this.entity = Object.assign({}, e);
      this.action = "EDIT";
      this.dlg_new = true;
    },
    showRemove(e) {
      this.entity = Object.assign({}, e);
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
.entities {
  &__menu {
    padding-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__title {
    margin: 0;
  }
}
</style>