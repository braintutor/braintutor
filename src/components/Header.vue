<template>
  <div style="z-index: var(--z-header) !important">
    <header class="header">
      <div class="header__logo" @click="redirect('home')">
        <v-img
          alt="BrainTutor Logo"
          src="@/assets/logo/logo-small.jpg"
          width="140"
        />
      </div>
      <v-spacer></v-spacer>
      <div class="header__actions">
        <v-btn
          v-for="(link, l_idx) in links_filtered"
          :key="l_idx"
          class="header__action"
          text
          @click="redirect(link.name)"
          >{{ link.title }}</v-btn
        >
        <!-- User -->
        <div
          id="user"
          class="user"
          v-if="user"
          @click="user_options = !user_options"
        >
          <span class="user__name">{{ user.name }}</span>
          <span class="user__role">{{ roles[user.role] }}</span>
          <div class="user__avatar">
            <img src="@/assets/icons/icon-user.svg" alt />
          </div>
          <div v-show="user_options" class="user__options">
            <v-btn small text @click="redirect('profile')">Perfil</v-btn>
            <v-btn small text @click="closeSession()">Cerrar Sesión</v-btn>
          </div>
        </div>
        <v-btn class="header__action" v-else text @click="redirect('schools')"
          >Iniciar Sesión</v-btn
        >
      </div>
      <v-app-bar-nav-icon
        class="nav-icon"
        @click="drawer = true"
      ></v-app-bar-nav-icon>
    </header>

    <v-navigation-drawer
      style="z-index: var(--z-nav) !important"
      v-model="drawer"
      fixed
      temporary
    >
      <div class="nav-logo">
        <v-img
          alt="BrainTutor Logo"
          src="@/assets/braintutor/icon.png"
          width="25"
        />
      </div>
      <div class="user ml-0" v-if="user" @click="user_options = !user_options">
        <span class="user__name">{{ user.name }}</span>
        <span class="user__role">{{ roles[user.role] }}</span>
      </div>
      <v-list>
        <v-list-item-group active-class="blue--text text--accent-4">
          <v-list-item
            v-for="(link, l_idx) in links_filtered"
            :key="l_idx"
            @click="
              redirect(link.name);
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user"
            @click="
              redirect('profile');
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Perfil</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="
              enableFullscreen();
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-fullscreen</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Pantalla completa</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-if="user"
            @click="
              closeSession();
              drawer = false;
            "
          >
            <v-list-item-icon>
              <v-icon>mdi-power</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Cerrar Sesión</v-list-item-title>
          </v-list-item>
          <v-list-item
            v-else
            @click="
              redirect('schools');
              drawer = false;
            "
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
      // ADM
      {
        title: "Colegio",
        name: "school-editor",
        icon: "mdi-school",
        session_roles: ["ADM"],
      },
      // TEA
      {
        title: "Cursos",
        name: "teacher-sessions",
        icon: "mdi-book",
        session_roles: ["TEA"],
      },
      {
        title: "Editar",
        name: "courses-editor",
        icon: "mdi-file-edit",
        session_roles: ["TEA"],
      },
      // STU
      {
        title: "Cursos",
        name: "student-sessions",
        icon: "mdi-book",
        session_roles: ["STU"],
      },
      // DIR
      {
        title: "Cursos",
        name: "director-sessions",
        icon: "mdi-book",
        session_roles: ["DIR"],
      },
      {
        title: "Alumnos",
        name: "director-students",
        icon: "mdi-school",
        session_roles: ["DIR"],
      },
      {
        title: "Reportes",
        name: "director-reports",
        icon: "mdi-book",
        session_roles: ["DIR"],
      },
      // PAR
      {
        title: "Cursos",
        name: "parent-sessions",
        icon: "mdi-book",
        session_roles: ["PAR"],
      },
      {
        title: "Alumnos",
        name: "parent-students",
        icon: "mdi-school",
        session_roles: ["PAR"],
      },
      // *
      {
        title: "Agenda",
        name: "events",
        icon: "mdi-calendar",
        session_roles: ["TEA", "STU"],
      },
    ],
    roles: {
      ADM: "ADMINISTRADOR",
      TEA: "PROFESOR",
      STU: "ESTUDIANTE",
      DIR: "DIRECTOR",
      PAR: "PADRE",
    },
    user_options: false,
    drawer: false,
  }),
  mounted() {
    window.addEventListener("click", (e) => {
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
        (l) => this.user && l.session_roles.includes(this.user.role)
      );
    },
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    redirect,
    closeSession() {
      let user = this.$store.state.user;
      this.$store.state.user = null;
      localStorage.removeItem("token");

      if (user && user.school)
        this.$router.push({
          name: "login",
          params: { school_url: user.school.url },
        });
      else redirect("schools");
    },
    enableFullscreen() {
      let container = document.getElementById("braintutor");
      container.requestFullscreen();
    },
  },
};
</script>

<style lang='scss' scoped>
.header {
  height: 56px;
  padding: 0 14px;
  padding-right: 10px;

  display: flex;
  align-items: center;

  &__logo {
    transition: 0.3s;
    cursor: pointer;
    &:hover {
      transform: scale(1.05);
    }
  }

  &__actions {
    display: flex;
    align-items: center;
  }

  &__action {
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
  padding: 8px;
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
    color: var(--color-active);
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
  .header {
    &__actions {
      display: none;
    }
  }
  .nav-icon {
    display: unset;
  }
}
</style>