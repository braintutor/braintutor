<template>
  <div class="m-container">
    <h2>Cambio de contraseña</h2>
    <!-- <p>Hola Arthur</p> -->
    <v-form @submit.prevent="newPassword">
      <v-text-field type="password" v-model="password" placeholder="Ingrese su nueva contraseña" 
        filled rounded dense
        :rules="passwordRules"></v-text-field>
      <v-text-field type="password" v-model="confirmPassword" placeholder="Confirme su nueva contraseña" 
        filled rounded dense
        :rules="confirmationPasswordRules"></v-text-field>
      <v-btn type="submit" color="primary">Cambiar contraseña</v-btn>      
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
      passwordRules: [
        (v) => !!v || 'Password es requerido',
        // (v) => passwordPolicy(v)
      ]
    }
  },
  methods: {
    async newPassword() {
      this.showLoading("Enviando correo");
      try {
        await resetPassword(this.password, this.token)
        this.showMessage("", "Contraseña cambiada correctamente");
        this.$router.push("/login")
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    }
  },
  computed: {
    token() {
      return this.$route.params.token 
    },
    confirmationPasswordRules() {
      return [
        () => (this.password === this.confirmPassword) || 'Password deben ser iguales',
        v => !!v || 'Password de confirmación es requerido'
      ];
    },
  }
};
</script>

<style>
</style>