<template>
  <div style="z-index: 100 !important">
    <v-app-bar flat style="background: #ffffff00 !important">
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
        <!-- User -->
        <div id="user" class="user" v-if="user" @click="user_options = !user_options">
          <span class="user__name">{{user.name}}</span>
          <span class="user__role">{{roles[user.role]}}</span>
          <div class="user__avatar">
            <img src="https://i.ya-webdesign.com/images/avatar-png-1.png" alt />
          </div>
          <div v-show="user_options" class="user__options">
            <v-btn small text @click="redirect('profile')">Perfil</v-btn>
            <v-btn small text @click="closeSession()">Cerrar Sesión</v-btn>
          </div>
        </div>
        <v-btn
          class="header-action"
          v-else
          text
          @click="redirect('login', {school_user: 'maria-prado-de-bellido'})"
        >Iniciar Sesión</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer style="z-index: 100 !important" v-model="drawer" fixed temporary>
      <div class="nav-logo">
        <v-img alt="BrainTutor Logo" src="@/assets/braintutor/icon.png" width="25" />
      </div>
      <div class="user ml-0" v-if="user" @click="user_options = !user_options">
        <span class="user__name">{{user.name}}</span>
        <span class="user__role">{{roles[user.role]}}</span>
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
          <v-list-item v-if="user" @click="redirect('profile'); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="user" @click="closeSession(); drawer=false">
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-else
            @click="redirect('login', {school_user: 'maria-prado-de-bellido'}); drawer=false"
          >
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

export default {
  data: () => ({
    links: [
      // 0
      {
        title: "Colegio",
        name: "school-editor",
        icon: "mdi-school",
        session_roles: ["ADM"]
      },
      // 1
      {
        title: "Cursos",
        name: "sessions-teacher",
        icon: "mdi-book",
        session_roles: ["TEA"]
      },
      {
        title: "Editar",
        name: "courses-editor",
        icon: "mdi-book",
        session_roles: ["TEA"]
      },
      // 2, 4
      {
        title: "Cursos",
        name: "sessions-student",
        icon: "mdi-book",
        session_roles: ["STU", "PAR"]
      },
      // {
      //   title: "Tareas",
      //   name: "tasks",
      //   icon: "mdi-book",
      //   session_roles: ['STU', 'PAR']
      // },
      {
        title: "Agenda",
        name: "events",
        icon: "mdi-book",
        session_roles: ["STU", "PAR"]
      },
      // 3
      {
        title: "Colegio",
        name: "director",
        icon: "mdi-school",
        session_roles: ["DIR"]
      }
    ],
    roles: {
      ADM: "ADMINISTRADOR",
      TEA: "PROFESOR",
      STU: "ESTUDIANTE",
      DIR: "DIRECTOR",
      PAR: "PADRE"
    },
    user_options: false,
    drawer: false
  }),
  mounted() {
    window.addEventListener("click", e => {
      let user = document.getElementById("user");
      if (user && user.contains(e.target)) {
        // Clicked in box
      } else {
        if (this.user_options) this.user_options = false;
      }
    });
  },
  computed: {
    links_filtered() {
      return this.links.filter(
        l => this.user && l.session_roles.includes(this.user.role)
      );
    },
    user() {
      return this.$store.state.user;
    }
  },
  methods: {
    redirect,
    closeSession() {
      this.$store.state.user = null;
      localStorage.removeItem("token");
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
  display: flex;
  align-items: center;
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

.user {
  position: relative;
  padding: 10px;
  margin-left: 20px;
  border-radius: 4px;
  transition: background-color 0.5s;
  cursor: pointer;
  display: grid;
  grid-template-rows: repeat(2, auto);
  grid-template-columns: repeat(2, auto);
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  &:hover {
    background: #ebebeb;
  }
  &__name {
    color: #6d6d6d;
    text-align: right;
    font-size: 0.75rem;
    font-weight: bold;
  }
  &__role {
    color: #5856da;
    text-align: right;
    font-size: 0.65rem;
    font-weight: bold;
  }
  &__avatar {
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 2;
    img {
      vertical-align: bottom;
      max-width: 32px;
    }
  }
  &__options {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    // width: 100%;
    background: #fff;
    // padding: 10px;
    font-size: 0.9rem;
    border-radius: 4px;
    box-shadow: 0 2px 6px #c7c7c7;
    //
    display: flex;
    flex-direction: column;
  }
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