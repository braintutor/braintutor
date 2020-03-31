<template>
  <div>
    <v-app-bar flat color="white">
      <div class="header-logo" @click="redirect('home')">
        <v-img alt="BrainTutor Logo" src="@/assets/braintutor/logo.png" width="160" />
      </div>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon class="nav-icon" @click="drawer = true"></v-app-bar-nav-icon>
      <div class="header-actions">
        <v-btn
          v-for="(link, l_idx) in links_filtered"
          :key="l_idx"
          class="header-action"
          text
          @click="redirect(link.name)"
        >{{link.title}}</v-btn>
        <v-btn
          class="header-action"
          v-if="session && session.token"
          text
          @click="closeSession()"
        >Cerrar Sesión</v-btn>
        <v-btn class="header-action" v-else text @click="redirect('login')">Iniciar Sesión</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" fixed temporary>
      <div class="nav-logo">
        <v-img alt="BrainTutor Logo" src="@/assets/braintutor/icon.png" width="25" />
      </div>
      <v-list>
        <v-list-item-group active-class="blue--text text--accent-4">
          <v-list-item
            v-for="(link, l_idx) in links_filtered"
            :key="l_idx"
            @click="redirect(link.name); drawer=false"
          >
            <v-list-item-icon>
              <v-icon>{{link.icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{link.title}}</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="session && session.token" @click="closeSession(); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="redirect('login'); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Iniciar Sesión</v-list-item-title>
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
        title: "Cursos",
        name: "teacher",
        icon: "mdi-book",
        session_types: ["1"]
      },
      {
        title: "Cursos",
        name: "student",
        icon: "mdi-book",
        session_types: ["2"]
      },
      {
        title: "Colegio",
        name: "school-editor",
        icon: "mdi-school",
        session_types: ["0"]
      },
      {
        title: "Perfil",
        name: "profile",
        icon: "mdi-account",
        session_types: ["2"]
      }
    ],
    drawer: false
  }),
  computed: {
    links_filtered() {
      return this.links.filter(
        l => this.session && l.session_types.includes(this.session.type)
      );
    },
    session() {
      return this.$store.state.session;
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
.nav-logo {
  width: max-content;
  margin: 22px auto 12px;
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