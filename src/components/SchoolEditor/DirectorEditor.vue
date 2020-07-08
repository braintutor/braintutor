<template>
  <div class="form m-card">
    <loading :active="loading" :message="loading_msg" />

    <h1 class="form__title">Director</h1>
    <form class="form__body">
      <span class="form__item">Nombres:</span>
      <v-text-field v-if="show_edit" v-model="director.first_name" hide-details dense />
      <span v-else class="form__value">{{director.first_name}}</span>
      <span class="form__item">Apellidos:</span>
      <v-text-field v-if="show_edit" v-model="director.last_name" hide-details dense />
      <span v-else class="form__value">{{director.last_name}}</span>
      <span class="form__item">Usuario:</span>
      <v-text-field v-if="show_edit" v-model="director.username" hide-details dense />
      <span v-else class="form__value">{{director.username}}</span>
    </form>

    <div class="form__actions">
      <v-btn v-if="show_edit" @click="save()" small rounded outlined text>
        <v-icon class="mr-2" style="font-size: 1.2rem">mdi-close</v-icon>Finalizar
      </v-btn>
      <v-btn
        v-if="!show_edit && director._id"
        @click="new_password = ''; confirm_new_password = ''; dlg_password = true"
        class="mr-2"
        small
        rounded
        outlined
        text
      >Cambiar Contraseña</v-btn>
      <v-btn v-if="!show_edit" @click="show_edit= true" small rounded outlined text>
        <v-icon class="mr-2" style="font-size: 1.2rem">mdi-pencil</v-icon>Editar
      </v-btn>
    </div>

    <!-- DIALOG PASSWORD -->
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

import { getDirector, updateDirector } from "@/services/directorService";
import { updatePasswordByAdmin } from "@/services/userService";

export default {
  data: () => ({
    director: {},
    show_edit: false,
    //
    new_password: "",
    confirm_new_password: "",
    dlg_password: false,
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Datos";
    try {
      this.director = (await getDirector()) || {};
    } catch (error) {
      this.$root.$children[0].showMessage("", error.msg);
    }
    this.loading = false;
  },
  methods: {
    async save() {
      this.loading = true;
      this.loading_msg = "Guardando";
      try {
        let _id = await updateDirector(this.director);
        if (_id) this.director._id = _id;
        this.show_edit = false;
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }
      this.loading = false;
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
        await updatePasswordByAdmin(this.director._id.$oid, this.new_password);
        this.$root.$children[0].showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg);
      }

      this.loading = false;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.form {
  max-width: 450px;
  margin: 0 auto;
  padding: 18px 24px;
  border-radius: 0;
  border-left: 6px solid #578cd1;

  &__title {
    margin: 0;
    font-size: 1.6rem;
  }
  &__body {
    margin-top: 20px;
    padding: 0 2px;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 22px;
    row-gap: 12px;
    align-items: flex-end;
  }
  &__actions {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
  }
  //
  &__item {
    font-weight: bold;
  }
  &__value {
    color: #575757;
  }
}
</style>