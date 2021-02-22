<template>
  <div class="m-container">
    <h2>¿Cómo deseas restablecer tu contraseña?</h2>
    <p>Te enviaremos un correo electrónico a tu cuenta</p>
    <v-form @submit.prevent="resetPassword">
      <v-text-field class="text-f" v-model="email" placeholder="Correo" type="email" filled rounded dense :rules="emailRules"></v-text-field>
      <v-btn type="submit"  color="primary">Enviar</v-btn>
    </v-form>
  </div>
</template>
<script>
import { requestResetPassword } from "@/services/resetPasswordService";

export default {
    data() {
        return {
            email: "",
            emailRules: [v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Correo invalido'],
         }
    },
    methods: {
      async resetPassword() {
          await requestResetPassword(this.email)
      }
    }
}
</script>

<style lang="scss" scoped>

.text-f ::v-deep .v-messages__message {
  padding-top: 8px;
}
</style>