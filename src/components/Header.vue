<template>
  <div>
    <v-app-bar app elevate-on-scroll color="white">
      <div class="header-logo" @click="redirect('home')">
        <v-img alt="BrainTutor Logo" src="@/assets/braintutor/logo.png" width="160" />
      </div>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon class="nav-icon" @click="drawer = true"></v-app-bar-nav-icon>
      <div class="header-actions">
        <v-btn
          v-for="(link, l_idx) in links"
          :key="l_idx"
          class="header-action"
          text
          @click="redirect(link.name)"
        >{{link.title}}</v-btn>
        <v-btn
          class="header-action"
          v-if="!session_exists"
          text
          @click="redirect('login')"
        >Iniciar Sesión</v-btn>
        <v-btn class="header-action" v-else text @click="closeSession()">Cerrar Sesión</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <v-list>
        <v-list-item-group active-class="blue--text text--accent-4">
          <v-list-item
            v-for="(link, l_idx) in links"
            :key="l_idx"
            @click="redirect(link.name); drawer=false"
          >
            <v-list-item-icon>
              <v-icon>{{`mdi-${link.icon}`}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{link.title}}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="!session_exists" @click="redirect('login'); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Iniciar Sesión</v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="closeSession(); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { redirect } from "@/services/router.js";
import { removeSession } from "@/services/security.js";

export default {
  data: () => ({
    links: [
      {
        title: "Inicio",
        name: "home",
        icon: "home"
      },
      {
        title: "Cursos",
        name: "panel",
        icon: "book"
      }
    ],
    drawer: false
  }),
  computed: {
    session_exists() {
      return this.$store.state.session_exists;
    }
  },
  methods: {
    redirect,
    closeSession() {
      removeSession();
      redirect("home");
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
.header-actions {
  .header-action {
    padding: 0 20px;
    font-weight: bold;
  }
}
.nav-icon {
  display: none;
}

@media only screen and (max-width: 690px) {
  .header-actions {
    display: none;
  }
  .nav-icon {
    display: unset;
  }
}
</style>