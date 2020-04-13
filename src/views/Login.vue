<template>
  <div class="m-fullcenter">
    <loading :active="loading" />
    <v-card class="login_container" elevation="6">
      <div class="login_icon">
        <img src="@/assets/braintutor/icon.png" width="100%" />
      </div>
      <div class="login_name">
        <img src="@/assets/braintutor/name.png" width="100%" />
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

          <v-select
            class="mb-4"
            v-model="school_id"
            :items="schools"
            item-text="name"
            item-value="id"
            label="Colegio"
          ></v-select>
          <v-select class="mb-4" v-model="type" :items="types" label="Tipo"></v-select>

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
import loading from "@/components/loading";

import {
  loginAdmin,
  loginTeacher,
  loginStudent,
  loginDirector,
  loginParent
} from "@/services/loginService";
import { getSchools } from "@/services/schoolService";
import { setSession } from "@/services/security";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    schools: [],
    types: ["Estudiante", "Profesor", "Padre", "Director", "Administrador"],
    //
    school_id: "",
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
    let schools = await getSchools();
    this.schools = schools.map(school => ({
      ...school,
      id: school._id.$oid
    }));
    this.loading = false;
  },
  methods: {
    async login() {
      try {
        if (this.$refs.form_login.validate()) {
          this.loading_login = true;
          let token = "";
          let name = "";
          let type = -1;

          if (this.type === "Administrador") {
            token = (await loginAdmin(this.school_id, this.user, this.pass))
              .token;
            name = "school-editor";
            type = 0;
          }
          if (this.type === "Profesor") {
            token = (await loginTeacher(this.school_id, this.user, this.pass))
              .token;
            name = "teacher";
            type = 1;
          }
          if (this.type === "Estudiante") {
            token = (await loginStudent(this.school_id, this.user, this.pass))
              .token;
            name = "student";
            type = 2;
          }
          if (this.type === "Director") {
            token = (await loginDirector(this.school_id, this.user, this.pass))
              .token;
            name = "director";
            type = 3;
          }
          if (this.type === "Padre") {
            token = (await loginParent(this.school_id, this.user, this.pass))
              .token;
            name = "parent";
            type = 4;
          }

          if (token) {
            setSession(token, type);
            redirect(name);
          } else {
            this.alert_error = true;
            this.loading_login = false;
          }
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