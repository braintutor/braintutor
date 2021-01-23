<template>
  <brain-dialog v-model="isShow" @submit="confirm" maxWidth="400">
    <template #body>
      <div class="close-modal">
        <h3>{{ dialog.title }}</h3>
        <v-btn class="mx-2" icon small @click="close">
          <v-icon> mdi-close-thick </v-icon>
        </v-btn>
      </div>
      <div>
        <p v-html="dialog.message"></p>
      </div>
    </template>
    <template #actions>
      <m-btn :color="dialog.color" type="submit" :loading="loading" small>{{
        dialog.accion
      }}</m-btn>
    </template>
  </brain-dialog>
</template>

<script>
import BrainDialog from "@/components/SchoolEditor/BrainDialog";
import { events } from "./events";

const dialogData = {
  title: "",
  message: "",
  accion: "",
  color: "",
  callback: () => {},
};

export default {
  components: { BrainDialog },
  data() {
    return {
      isShow: false,
      loading: false,
      dialog: dialogData,
      params: {},
    };
  },
  mounted() {
    if (!document) return;
    events.$on("open", this.open);
    events.$on("close", () => {
      this.handleClickOverlay({ target: { id: "vueConfirm" } });
    });
  },
  methods: {
    close() {
      this.isShow = false;
      if (this.params.callback) {
        this.params.callback(false);
      }
    },
    handleClickOverlay({ target }) {
      if (target.id == "vueConfirm") {
        this.close();
      }
    },
    confirm() {
      this.isShow = false;
      if (this.params.callback) {
        this.params.callback(true);
      }
    },
    resetState() {
      this.dialog = dialogData;
    },
    open(params) {
      this.resetState();
      this.params = { ...this.dialog, ...params };
      this.isShow = true;
      Object.entries(params).forEach(([key, value]) => {
        if (typeof value == typeof this.dialog[key]) {
          this.dialog[key] = value;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
