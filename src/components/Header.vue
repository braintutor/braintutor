<template>
  <v-app-bar app flat color="white">
    <div class="header-logo" @click="redirect('home')">
      <v-img alt="BrainTutor Logo" src="@/assets/logo.png" width="160" />
    </div>
    <v-spacer></v-spacer>
    <v-btn text @click="redirect('login')">Iniciar Sesión</v-btn>
  </v-app-bar>
</template>

<script>
import { redirect } from "@/services/tools.js";

export default {
  data: () => ({
    dialog_login: false
  }),
  methods: {
    redirect
  }
};
</script>

<style lang='scss'>
.header-logo {
  &:hover {
    cursor: pointer;
  }
}
</style>