<template>
  <div class="m-container">
    <v-card v-for="(item, idx) in classes" :key="idx" class="mx-auto my-12">
      <v-card-title class="time"
        >{{ item.start }} - {{ item.end }}
      </v-card-title>
      <v-card-actions>
        <v-btn
          v-if="item.recording"
          :href="item.recording.url"
          target="__blank"
          color="primary"
          small
          rounded
        >
          <v-icon small class="mr-2">mdi-eye</v-icon>Ver grabación
        </v-btn>
      </v-card-actions>
    </v-card>
    <div class="text-center" v-show="!loading && classes.length === 0">
      No hay clases.
    </div>
  </div>
</template>

<script>
import { getAll } from "./service";
import { getParam, redirect } from "@/services/router.js";

export default {
  data: () => ({
    session_id: "",
    classes: [],
    loading: true,
  }),
  mounted() {
    this.showLoading("Cargando Clases");
    this.loading = true;
    getAll({ session: this.session_id })
      .then(({ results }) => {
        this.classes = results;
        this.loading = false;
        this.hideLoading();
      })
      .catch((error) => {
        this.loading = false;
        this.hideLoading();
        this.showMessage("", error.msg || error);
      });
  },
  async created() {
    this.session_id = getParam("session_id");
  },
  computed: {},
  methods: {
    seeRecord({ url }) {
      redirect(url);
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
