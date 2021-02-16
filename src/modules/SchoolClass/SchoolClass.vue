<template>
  <div class="m-container">
    <!-- <v-card v-for="(item, idx) in classes" :key="idx" class="mx-auto my-12"> -->
    <v-card
      v-for="(item, idx) in classes"
      :key="idx"
      class="mx-auto my-4 card-class"
      flat
      rounded="sm"
    >
      <v-card-title>
        <p>{{ item.start | date }} {{ item.start | day }}</p>
      </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <canvas></canvas>
          <div style="width: 100%">
            <p class="p-canvas">
              {{ item.start | time }} - {{ item.end | time }}
            </p>
            <h3 class="p-canvas">Clase</h3>
            <div class="d-flex justify-end">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-4"
                    fab
                    dark
                    open-on-focus
                    small
                    color="teal"
                    v-on="on"
                    v-if="item.recording"
                    :href="item.recording.url"
                    target="__blank"
                  >
                    <v-icon dark>
                     mdi-eye
                    </v-icon>
                  </v-btn>
                </template>
                <span>Grabación</span>
              </v-tooltip>
              <!-- <v-btn
                class="mx-4 bt-pencil"
                fab
                dark
                small
                color="teal"
              >
                <v-icon dark>
                  mdi-book-open-variant
                </v-icon>
              </v-btn> -->
            </div>
          </div>
        </div>
      </v-card-text>
      <!-- <v-card-title class="time"
        >Clase del dia {{ item.start | date }}
      </v-card-title>
      <v-card-text v-if="item.recording">
        Inicio: {{ item.recording.startTime | parseDate | time }} 
        <p> </p>
        Fin: {{ item.recording.endTime | parseDate | time }}
      </v-card-text>
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
      </v-card-actions> -->
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
    page: 1,
    classes: [],
    loading: true,
  }),
  mounted() {
    this.showLoading("Cargando Clases");
    this.loading = true;
    this.getData();
  },
  async created() {
    this.session_id = getParam("session_id");
  },
  computed: {},
  methods: {
    getData() {
      getAll({ session: this.session_id, page: this.page })
        .then(({ items, page }) => {
          this.classes = items;
          this.page = page;
          this.loading = false;
          this.hideLoading();
        })
        .catch((error) => {
          this.loading = false;
          this.hideLoading();
          this.showMessage("", error.msg || error);
        });
    },
    next() {
      this.page = this.page + 1;
      this.getData();
    },
    seeRecord({ url }) {
      redirect(url);
    },
  },
  filters: {
    parseDate(timestamp) {
      return new Date(parseInt(timestamp));
    },
  },
  components: {},
};
</script>

<style lang="scss" scoped>
.card-class {
  border-top: 1px solid gray;
}

p {
  margin-bottom: 0px;
}

canvas {
  background: rgba(0, 0, 0, 1);
}

.p-canvas {
  margin-left: 20px;
}

.v-card__title {
  padding: 10px 16px 10px 16px;
}

.v-card__text {
  padding: 0px 16px 10px;
}
</style>
