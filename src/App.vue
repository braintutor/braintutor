<template>
  <v-app>
    <Header />
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",
  data: () => ({
    //
  }),
  components: {
    Header
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
</style>
