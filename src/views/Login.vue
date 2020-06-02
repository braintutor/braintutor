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
      <!-- {{school}} -->
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
          <!-- <v-select
            class="mb-4"
            v-model="school_id"
            :items="schools"
            item-text="name"
            item-value="id"
            label="Colegio"
          ></v-select>-->
          <v-text-field v-model="user" :rules="userRules" label="Usuario"></v-text-field>
          <v-text-field v-model="pass" :rules="passRules" label="Contraseña" type="password"></v-text-field>
          <v-select class="mb-4" v-model="type" :items="types" label="Tipo"></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="loading_login" block color="primary" type="submit">Iniciar Sesión</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSchoolByUser } from "@/services/schoolService";
import {
  loginAdmin,
  loginTeacher,
  loginStudent,
  loginDirector,
  loginParent
} from "@/services/loginService";
import { redirect, getParam } from "@/services/router.js";

export default {
  data: () => ({
    school: {},
    // FORM
    types: ["Estudiante", "Profesor", "Padre", "Director", "Administrador"],
    type: "",
    user: "",
    pass: "",
    userRules: [v => !!v || "Usuario es requerido"],
    passRules: [v => !!v || "Contraseña es requerida"],
    //
    loading: true,
    alert_error: false,
    loading_login: false
  }),
  async mounted() {
    let school_user = getParam("school_user");
    this.school = await getSchoolByUser(school_user);
    this.loading = false;
  },
  methods: {
    async login() {
      try {
        if (this.$refs.form_login.validate()) {
          this.loading_login = true;
          let school_id = this.school._id.$oid;
          let res = {};
          let name = "";

          if (this.type === "Administrador") {
            res = await loginAdmin(school_id, this.user, this.pass);
            name = "school-editor";
          }
          if (this.type === "Profesor") {
            res = await loginTeacher(school_id, this.user, this.pass);
            name = "sessions-teacher";
          }
          if (this.type === "Estudiante") {
            res = await loginStudent(school_id, this.user, this.pass);
            name = "sessions-student";
          }
          if (this.type === "Director") {
            res = await loginDirector(school_id, this.user, this.pass);
            name = "director";
          }
          if (this.type === "Padre") {
            res = await loginParent(school_id, this.user, this.pass);
            name = "sessions-student";
          }

          let { token } = res;
          localStorage.setItem("token", token);
          redirect(name);
        }
      } catch (error) {
        this.alert_error = true;
        this.loading_login = false;
      }
    }
  },
  components: {
    loading
  }
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