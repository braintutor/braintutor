<template>
  <div>
    <h2>¿Cómo deseas restablecer tu contraseña?</h2>
    <p>Te enviaremos un correo electrónico a tu cuenta</p>
    <v-form @submit="resetPassword">
      <v-text-field v-model="email" placeholder="Correo" filled rounded dense></v-text-field>
      <v-btn type="submit">Enviar</v-btn>
    </v-form>
  </div>
</template>
<script>
import { requestResetPassword } from "@/services/resetPasswordService";

export default {
    data() {
        return {
            email: ""
         }
    },
    methods: {
        resetPassword() {
            requestResetPassword(this.email)
        }
    }
}
</script>