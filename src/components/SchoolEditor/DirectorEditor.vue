<template>
  <div>
    <form @submit.prevent="save()" class="director m-card">
      <div class="m-card__body">
        <h3>Director</h3>
        <v-text-field
          v-model="director.first_name"
          :maxlength="UserModel.first_name.max_length"
          label="Nombres"
          autocomplete="off"
          required
          class="mt-4"
        />
        <v-text-field
          v-model="director.last_name"
          :maxlength="UserModel.last_name.max_length"
          label="Apellidos"
          autocomplete="off"
          required
        />
        <v-text-field
          v-model="director.username"
          :maxlength="UserModel.username.max_length"
          label="Usuario"
          autocomplete="off"
          required
        />
      </div>
      <div class="m-card__actions">
        <m-btn
          v-if="director._id"
          @click="new_password = ''; confirm_new_password = ''; dlg_password = true"
          type="button"
          color="dark"
          small
          class="mr-2"
        >Cambiar Contraseña</m-btn>
        <m-btn type="submit" color="primary" small>Guardar</m-btn>
      </div>
    </form>

    <!-- DIALOG PASSWORD -->
    <v-dialog v-model="dlg_password" max-width="400" persistent>
      <form @submit.prevent="savePassword()" class="m-card">
        <div class="m-card__body">
          <v-text-field
            type="password"
            v-model="new_password"
            :maxlength="UserModel.password.max_length"
            label="Nueva contraseña"
            autocomplete="off"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            v-model="confirm_new_password"
            :maxlength="UserModel.password.max_length"
            label="Confirmar contraseña"
            autocomplete="off"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
          <m-btn
            @click="dlg_password = false"
            type="button"
            color="primary"
            small
            text
            class="mr-2"
          >Cerrar</m-btn>
          <m-btn type="submit" color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>
  </div>
</template>

<script>
import { getDirector, updateDirector } from "@/services/directorService";
import { updatePasswordByAdmin } from "@/services/userService";

import UserModel from "@/models/User";

export default {
  data: () => ({
    director: {},
    //
    new_password: "",
    confirm_new_password: "",
    dlg_password: false,
    //
    UserModel,
  }),
  async created() {
    this.showLoading("Cargando Datos");
    try {
      this.director = (await getDirector()) || {};
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        let _id = await updateDirector(this.director);
        if (_id) this.director._id = _id;
        this.$forceUpdate();
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

      this.dlg_password = false;
      this.showLoading("Cambiando Contraseña");
      try {
        await updatePasswordByAdmin(this.director._id.$oid, this.new_password);
        this.showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
.director {
  max-width: 600px;
  margin: 0 auto;
}
</style>