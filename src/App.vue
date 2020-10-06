<template>
  <v-app class="m-app" id="braintutor">
    <Header />
    <v-main class="m-app__body">
      <router-view></router-view>
    </v-main>
    <loading :active="loading" :message="loading_msg" />
    <loading :active="loading_user" />
    <Chatbot v-if="show_chatbot" :knowledge="knowledge" />
    <!-- Message -->
    <v-dialog v-model="dlg_message" max-width="320" persistent>
      <div class="m-msg">
        <div class="m-msg__body">
          <p v-if="show_title" class="m-msg__title">{{ show_title }}</p>
          <p
            v-for="(m, idx) in show_messages"
            :key="idx"
            class="m-msg__description"
          >
            {{ m }}
          </p>
        </div>
        <button @click="dlg_message = false" class="m-msg__btn">Cerrar</button>
      </div>
    </v-dialog>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import loading from "./components/loading";
import Chatbot from "@/components/MChatbot/index";

import { updateStudentTime } from "@/services/studentService";

import { mapState } from "vuex";

export default {
  name: "App",
  data: () => ({
    dlg_message: false,
    show_title: "",
    show_messages: "",
  }),
  computed: {
    ...mapState([
      "user",
      "loading",
      "loading_msg",
      "loading_user",
      "show_chatbot",
      "knowledge",
    ]),
  },
  mounted() {
    // TIME
    setInterval(async () => {
      try {
        if (this.user && this.user.role === "STU") await updateStudentTime();
      } catch (error) {
        //
      }
    }, 60000);

    // PROTOTYPE
    Date.prototype.addHours = function (h) {
      this.setHours(this.getHours() + h);
      return this;
    };
  },
  methods: {
    showMessage(title, message) {
      this.dlg_message = true;
      this.show_title = title;
      this.show_messages = (message + "").split("&&");
    },
  },
  components: {
    Header,
    loading,
    Chatbot,
  },
};
</script>

<style lang="scss">
.m-app {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  &__body {
    height: calc(100vh - 56px);
    overflow-y: overlay;
  }
}

.m-msg {
  padding: 10px;
  background: #fff;
  border-radius: 16px;

  &__body {
    padding: 20px;
  }

  &__title {
    margin-bottom: 20px !important;
    color: rgb(78, 78, 78);
    text-align: center;
    font-weight: bold;
    font-size: 1.25rem;
  }

  &__description {
    // margin-bottom: 0 !important;
    color: rgb(109, 109, 109);
    text-align: center;
    font-size: 0.9rem;
  }

  &__btn {
    width: 100%;
    padding: 10px;
    color: rgb(109, 109, 109);
    font-size: 0.8rem;
    text-transform: uppercase;
    border-radius: 16px;
    transition: 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.075);
    }
    &:focus {
      outline: none;
    }
    &:active {
      background: rgba(0, 0, 0, 0.15);
    }
  }
}

// HTML
p {
  font-size: 0.9rem;
}
textarea {
  font-size: 0.9rem !important;
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
.v-text-field {
  * {
    font-size: 0.95rem !important;
  }
  & .v-counter {
    font-size: 0.75rem !important;
  }
}
.v-input {
  margin: 0 !important;
}
.v-input--selection-controls__input {
  margin: 0 !important;
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
.codex-editor__redactor {
  margin-right: 0 !important;
}
</style>
