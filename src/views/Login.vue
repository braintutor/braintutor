<template>
  <div class="m-fullcenter">
    <v-card class="login_container" elevation="6">
      <div class="login_icon">
        <img src="@/assets/icon.png" width="100%" />
      </div>
      <div class="login_name">
        <img src="@/assets/name.png" width="100%" />
      </div>
      <v-form ref="form_login" @submit.prevent="login">
        <v-card-text class="login_content">
          <v-alert
            v-model="alert_error"
            type="error"
            icon="mdi-cloud-alert"
            text
            dismissible
          >Usuario o contraseña incorrecta</v-alert>
          <v-text-field v-model="user" :rules="userRules" label="Usuario"></v-text-field>
          <v-text-field v-model="pass" :rules="passRules" label="Contraseña" type="password"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loading_login" block color="primary" type="submit">Iniciar Sesión</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { loginTeacher } from "@/services/loginService";
import { setSession } from "@/services/security";
import { redirect } from "@/services/tools.js";

export default {
  data: () => ({
    user: "",
    pass: "",
    userRules: [v => !!v || "Usuario es requerido"],
    passRules: [v => !!v || "Contraseña es requerida"],
    //
    alert_error: false,
    loading_login: false
  }),
  methods: {
    redirect,
    login() {
      if (this.$refs.form_login.validate()) {
        this.loading_login = true;
        loginTeacher(this.user, this.pass).then(res => {
          let token = res["profesor_id"];
          if (token) {
            setSession(token, 0);
            this.redirect("panel");
          } else {
            this.alert_error = true;
          }
          this.loading_login = false;
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.login_container {
  width: 340px;
  padding: 24px 0 0;

  .login_icon {
    max-width: 100px;
    margin: 0 auto;
  }
  .login_name {
    max-width: 150px;
    margin: 0 auto;
  }
  .login_content {
    padding: 14px 20px;
  }
}
</style>