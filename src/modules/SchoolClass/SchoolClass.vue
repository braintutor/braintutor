<template>
  <div class="m-container">
    <!-- <v-card v-for="(item, idx) in classes" :key="idx" class="mx-auto my-12"> -->
    <v-card v-for="(item, idx) in classes" :key="idx" class="mx-auto my-4 card-class" flat rounded="sm">
      <v-card-title>
        <p>12 Marzo | Viernes</p>
      </v-card-title>
      <v-card-text>
        <!-- <p class="desc">clase de sumas y restas</p> -->
        <div class="d-flex">
          <canvas></canvas>
          <div style="width: 100%">
            <p class="p-canvas">08:00 - 10:30</p>
            <h3 class="p-canvas">Clase de sumas y restas</h3>
            <div class="d-flex justify-end">
              <v-btn
                class="mx-4 bt-pencil"
                fab
                dark
                small
                color="teal"
              >
                <v-icon dark>
                  mdi-pencil
                </v-icon>
              </v-btn>
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
      this.page = this.page + 1
      this.getData();
    },
    seeRecord({ url }) {
      redirect(url);
    },
  },
  filters: {
    parseDate(timestamp) {
      return new Date(parseInt(timestamp));
    }
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
  background: rgba(0,0,0,1);
}

.p-canvas {
    margin-left: 20px;
}

.v-card__title {
  padding: 10px 16px 10px 16px;
}

.v-card__text{
  padding: 0px 16px 10px;
}

// .desc {
//   padding-bottom: 10px;
// }

// .bt-pencil {

// }
</style>
