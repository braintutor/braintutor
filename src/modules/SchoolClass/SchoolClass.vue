<template>
  <div class="m-container" id="clases_lista" @wheel="moverse">
    <!-- <v-card v-for="(item, idx) in classes" :key="idx" class="mx-auto my-12"> -->
    <v-card
      v-for="(item, idx) in classesShow"
      :key="idx"
      class="mx-auto my-4 card-class"
      flat
      rounded="sm"
    >
      <v-card-title>
        <p>{{ item.start | dayMonth }} | {{ item.start | dayWeek }}</p>
      </v-card-title>
      <v-card-text>
        <div class="d-flex">
          <canvas></canvas>
          <div style="width: 100%">
            <p class="p-canvas">
              {{ item.start | time }} - {{ item.end | time }}
            </p>
            <h3 class="p-canvas">Clase</h3>
            <div class="d-flex justify-end align-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    class="mx-4"
                    to="tasks"
                    fab
                    dark
                    open-on-focus
                    small
                    color="teal"
                    v-on="on"
                  >
                    <v-icon dark> mdi-notebook-edit-outline </v-icon>
                  </v-btn>
                </template>
                <span>tareas</span>
              </v-tooltip>
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
    classesShow: [],
    cantidad: 0,
    loading: true,
    bloquear_traer_mas: false,
  }),
  mounted() {
    this.showLoading("Cargando Clases");
    this.loading = true;
    this.getData();
  },
  async created() {
    this.session_id = getParam("session_id");
    window.addEventListener("scroll", this.moverse);
  },
  destroyed() {
    window.removeEventListener("scroll", this.moverse);
  },
  computed: {},
  methods: {
    mostrarMasSchools(cantidadAagregar) {
      console.log(this.cantidad);
      for (
        let index = this.cantidad;
        this.cantidad < this.classes.length &&
        this.cantidad < index + cantidadAagregar;
        this.cantidad++
      ) {
        const clase = this.classes[this.cantidad];
        console.log(clase);
        this.classesShow.push(clase);
      }
      console.log(this.classesShow);
    },
    getData() {
      getAll({ session: this.session_id, page: this.page })
        .then(({ items, page }) => {
          this.classes = items;
          console.log(this.classes);
          this.mostrarMasSchools(3);
          this.page = page;
          this.loading = false;
          this.posicionarse_abajo();
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
    moverse(event) {
      console.log(event);
      if (
        !this.bloquear_traer_mas &&
        this.classes &&
        this.classes.length > 5 &&
        this.classes.length > this.classesShow.length
      ) {
        const clases = document.getElementById("clases_lista");
        if (clases && clases !== null) {
          console.log(clases.offsetHeight);
          console.log(clases.clientHeight);
          console.log(clases.scrollHeight);
          console.log(clases.scrollTop);
          if (clases.scrollTop < 65) {
            this.bloquear_traer_mas = true;
            this.traer_mas();
          }
        }
      }
    },
    posicionarse_abajo() {
      const clases = document.getElementById("clases_lista");
      if (clases && clases !== null) {
        console.log(clases.offsetHeight);
        console.log(clases.clientHeight);
        console.log(clases.scrollHeight);
        console.log(clases.scrollTop);
        clases.scrollTop = clases.scrollHeight - 20;
        sessionStorage.setItem("anchoInicial", window.innerWidth + "");
        sessionStorage.setItem("altoInicial", window.innerHeight + "");
        this.bloquear_traer_mas = false;
      }
    },
    traer_mas() {
      console.log("Click en traer mas");
      this.mostrarMasSchools(5);
      // this.store.dispatch(new MostrarMasComentariosAction(this.elementos.length))
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
