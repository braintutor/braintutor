<template>
  <div style="z-index: 1 !important">
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
        <!-- User -->
        <div
          id="user"
          class="user"
          v-if="session && session.token"
          @click="user_options = !user_options"
        >
          <span class="user__name">{{JSON.parse(session.user || "{}").name}}</span>
          <span class="user__type">{{(JSON.parse(session.user || "{}").type || "").toUpperCase()}}</span>
          <div class="user__avatar">
            <img src="https://i.ya-webdesign.com/images/avatar-png-1.png" alt />
          </div>
          <div v-show="user_options" class="user__options">
            <v-btn v-show="session.type == '2'" small text @click="redirect('profile')">Perfil</v-btn>
            <v-btn small text @click="closeSession()">Cerrar Sesión</v-btn>
          </div>
        </div>
        <v-btn class="header-action" v-else text @click="redirect('login')">Iniciar Sesión</v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer style="z-index: 1 !important" v-model="drawer" fixed temporary>
      <div class="nav-logo">
        <v-img alt="BrainTutor Logo" src="@/assets/braintutor/icon.png" width="25" />
      </div>
      <div
        class="user ml-0"
        v-if="session && session.token"
        @click="user_options = !user_options"
      >
        <span class="user__name">{{JSON.parse(session.user || "{}").name}}</span>
        <span class="user__type">{{(JSON.parse(session.user || "{}").type || "").toUpperCase()}}</span>
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
          <!--  -->
          <v-list-item
            v-if="session && session.type == '2'"
            @click="redirect('profile'); drawer=false"
          >
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Perfil</v-list-item-title>
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
        title: "Cursos",
        name: "parent",
        icon: "mdi-book",
        session_types: ["4"]
      },
      {
        title: "Colegio",
        name: "school-editor",
        icon: "mdi-school",
        session_types: ["0"]
      },
      {
        title: "Colegio",
        name: "director",
        icon: "mdi-school",
        session_types: ["3"]
      }
    ],
    user: {},
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
    font-size: 0.7rem;
    font-weight: bold;
  }
  &__type {
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
    top: 100%;
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