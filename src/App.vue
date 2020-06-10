<template>
  <v-app>
    <Header />
    <v-content>
      <loading :active="loading" />
      <router-view></router-view>
    </v-content>
    <!-- showMessage -->
    <v-dialog v-model="show" max-width="320">
      <v-card>
        <v-card-title>{{show_title}}</v-card-title>
        <v-card-text v-show="show_message" style="font-size: .95rem">{{show_message}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="show = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import loading from "./components/loading";

import { updateStudentTime } from "@/services/studentService";
import { redirect } from "@/services/router";

export default {
  name: "App",
  data: () => ({
    show: false,
    show_title: "",
    show_message: ""
  }),
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    user() {
      return this.$store.state.user;
    }
  },
  mounted() {
    // TIME
    setInterval(async () => {
      try {
        if (this.user && this.user.type == 2) await updateStudentTime();
      } catch (error) {
        //
      }
    }, 60000);
    // GOOGLE
    let fragmentString = location.hash.substring(1);
    let params = {};
    var regex = /([^&=]+)=([^&]*)/g,
      m;
    while ((m = regex.exec(fragmentString))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (params.access_token)
      localStorage.setItem("access_token", params.access_token);

    let state = params["state"] || params["/state"];
    if (state) redirect("task", { task_id: state });

    // PROTOTYPE
    Date.prototype.addHours = function(h) {
      this.setHours(this.getHours() + h);
      return this;
    };
  },
  methods: {
    showMessage(title, message) {
      this.show = true;
      this.show_title = title;
      this.show_message = message;
    }
  },
  components: {
    Header,
    loading
  }
};
</script>

<style lang="scss">
.menu {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .menu-title {
    margin: 0 10px !important;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  .menu-left {
    flex-grow: 1;
    display: flex;
  }
  .menu-right {
    display: flex;
  }
}

.empty {
  margin: 10px;
  color: #797979;
  font-size: 1.1rem;
  font-weight: lighter;
  text-align: center;
}

.history {
  margin: 0 16px 8px;
  color: #868686;
  font-weight: bold;
  font-size: 0.9rem;
  //
  display: flex;
  align-items: center;
  &__back {
    border-radius: 10px;
    text-decoration: underline;
    cursor: pointer;
  }
  &__divider {
    color: #c9c9c9;
    margin: 0 8px;
  }
}

//Vuetify
.v-input {
  margin: 0 !important;
}
.v-input__slot {
  margin: 0 !important;
}
.v-input--selection-controls__input {
  margin: 0 !important;
}
.v-messages {
  display: none !important;
}

.v-input--radio-group__input {
  .v-radio {
    .v-label {
      margin-left: 8px;
      font-size: 1rem !important;
    }
  }
}
.v-input--selection-controls__ripple {
  display: none;
}

.v-select {
  & * {
    font-size: 1rem;
  }
  .v-text-field__details {
    display: none;
  }
}

// Editorjs
.codex-editor__redactor {
  padding-bottom: 64px !important;
}
.cdx-simple-image__caption {
  display: none !important;
}
.cdx-simple-image__picture--with-background {
  background: #fff !important;
}
.cdx-input.embed-tool__caption {
  display: none;
}
</style>
