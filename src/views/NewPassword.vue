<template>
  <div class="m-container">
    <h2>Cambio de contraseña</h2>
    <!-- <p>Hola Arthur</p> -->
    <v-form @submit.prevent="newPassword">
      <v-text-field type="password" v-model="password" placeholder="Ingrese su nueva contraseña" filled rounded dense></v-text-field>
      <v-text-field type="password" v-model="confirmPassword" placeholder="Confirme su nueva contraseña" filled rounded dense></v-text-field>
      <v-btn type="submit" color="primary">Guardar contraseña</v-btn>      
    </v-form>
  </div>
</template>

<script>
import { resetPassword } from "@/services/resetPasswordService";

export default {
  data(){
    return{
      password: "",
      confirmPassword: "",
      token: ""
    }
  },
  methods: {
    async newPassword() {
      this.showLoading("Enviando correo");
      try {
        await resetPassword(this.password, this.token)
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    }
  }
};
</script>

<style>
</style>