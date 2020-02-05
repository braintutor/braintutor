<template>
  <v-app-bar app flat color="white">
    <div class="header-logo" @click="redirect('home')">
      <v-img alt="BrainTutor Logo" src="@/assets/logo.png" width="160" />
    </div>
    <v-spacer></v-spacer>
    <v-btn v-if="!session_exists" text @click="redirect('login')">Iniciar Sesión</v-btn>
    <v-btn v-else text @click="closeSession()">Cerrar Sesión</v-btn>
  </v-app-bar>
</template>

<script>
import { redirect } from "@/services/tools.js";
import { removeSession } from "@/services/security.js";

export default {
  data: () => ({}),
  computed: {
    session_exists() {
      return this.$store.state.session_exists;
    }
  },
  methods: {
    redirect,
    closeSession() {
      removeSession();
      this.redirect("home");
    }
  }
};
</script>

<style lang='scss' scoped>
.header-logo {
  &:hover {
    cursor: pointer;
  }
}
</style>