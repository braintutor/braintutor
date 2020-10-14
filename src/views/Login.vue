<template>
  <v-form ref="form_login" @submit.prevent="login" class="login m-card">
    <div class="m-card__body">
      <div class="login__img">
        <!-- <img :src="require('@/assets/logo/logo-long.jpg')" width="100%" /> -->
        <img :src="school.image" width="100%" />
      </div>

      <div v-if="show_error" class="alert">
        <span>Datos incorrectos.</span>
        <v-icon @click="show_error = false" class="alert__icon"
          >mdi-close</v-icon
        >
      </div>

      <v-text-field
        v-model="username"
        :rules="usernameRules"
        :maxlength="UserModel.username.max_length"
        placeholder="Usuario"
        filled
        rounded
        dense
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        :maxlength="UserModel.password.max_length"
        placeholder="Contraseña"
        type="password"
        filled
        rounded
        dense
      ></v-text-field>
      <m-btn :loading="loading_login" color="primary" block
        >Iniciar Sesión</m-btn
      >
    </div>
  </v-form>
</template>

<script>
import { getSchoolByURL } from "@/services/schoolService";
import { login } from "@/services/loginService";
import { getParam, redirect } from "@/services/router.js";

import UserModel from "@/models/User";

export default {
  data: () => ({
    school: {},
    //
    UserModel,
    username: "",
    password: "",
    usernameRules: [(v) => !!v || "Usuario es requerido"],
    passwordRules: [(v) => !!v || "Contraseña es requerida"],
    //
    loading_login: false,
    show_error: false,
  }),
  async created() {
    this.showLoading("Cargando");
    let school_url = getParam("school_url");
    try {
      this.school = await getSchoolByURL(school_url);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
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
        this.loading_login = false;
        this.show_error = true;
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.login {
  max-width: 320px;
  margin: 20px auto;

  &__img {
    max-width: 180px;
    margin: 20px auto;
  }
}

.alert {
  padding: 10px 20px;
  margin-bottom: 24px !important;
  background: #ffe8e8;
  color: rgb(255, 130, 130);
  font-size: 0.9rem;
  border-radius: 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  &__icon {
    color: rgb(255, 130, 130);
    font-size: 1.2rem;
    cursor: pointer;
  }
}
</style>