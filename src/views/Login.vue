<template>
  <div class="m-fullcenter">
    <loading :active="loading" />
    <v-card class="login_container" elevation="6">
      <!-- <div class="login_icon">
        <img src="@/assets/braintutor/icon.png" width="100%" />
      </div>
      <div class="login_name">
        <img src="@/assets/braintutor/name.png" width="100%" />
      </div>-->
      <div class="login_icon">
        <img :src="school.image" width="100%" />
      </div>
      <v-form ref="form_login" @submit.prevent="login">
        <v-card-text class="login_content">
          <v-alert
            v-model="alert_error"
            type="error"
            icon="mdi-cloud-alert"
            text
            dismissible
          >Datos incorrectos.</v-alert>
          <v-text-field v-model="username" :rules="usernameRules" label="Usuario"></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            label="Contraseña"
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="pt-0">
          <m-btn color="primary" :loading="loading_login" block>Iniciar Sesión</m-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSchoolByURL } from "@/services/schoolService";
import { login } from "@/services/loginService";
import { redirect, getParam } from "@/services/router.js";

export default {
  data: () => ({
    school: {},
    // FORM
    username: "",
    password: "",
    usernameRules: [(v) => !!v || "Usuario es requerido"],
    passwordRules: [(v) => !!v || "Contraseña es requerida"],
    //
    loading: true,
    alert_error: false,
    loading_login: false,
  }),
  async mounted() {
    let school_user = getParam("school_user");
    try {
      this.school = await getSchoolByURL(school_user);
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    async login() {
      try {
        if (this.$refs.form_login.validate()) {
          this.loading_login = true;
          let school_id = this.school._id.$oid;
          let { token } = await login(school_id, this.username, this.password);
          localStorage.setItem("token", token);
          redirect("home");
        }
      } catch (error) {
        this.alert_error = true;
        this.loading_login = false;
      }
    },
  },
  components: {
    loading,
  },
};
</script>

<style lang='scss' scoped>
.login_container {
  width: 340px;
  padding: 24px 0 0;

  .login_icon {
    max-width: 100px;
    margin: 5px auto;
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