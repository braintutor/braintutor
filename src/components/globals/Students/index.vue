<template>
  <div>
    <div v-show="!student_selected">
      <slot></slot>
      <div v-show="students.length > 0" class="search mb-3">
        <input v-model="student_search" type="text" placeholder="Buscar" />
        <v-icon v-show="student_search" @click="student_search = ''"
          >mdi-close</v-icon
        >
      </div>
      <!-- Students List -->
      <div
        v-for="student in students_filtered"
        :key="student._id"
        @click="student_selected = student"
        class="student"
      >
        <div class="student__body">
          <div class="student__name">
            <v-icon class="mr-3">mdi-account-circle</v-icon>
            <span class="mt-1">{{
              `${student.last_name}, ${student.first_name}`
            }}</span>
          </div>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-2" icon small v-on="on">
                <v-icon style="font-size: 1.4rem">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list class="pa-0" dense>
              <v-list-item @click="student_selected = student">
                <v-list-item-title>Ver Más</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>

      <!-- STUDENT LEARN -->
      <div v-show="students.length > 0" class="chart m-card mt-3">
        <div class="m-card__body">
          <h3 class="text-center">Estilos de Aprendizaje (Promedio)</h3>
          <canvas id="crt" class="mt-4"></canvas>
        </div>
      </div>
    </div>

    <!-- Student -->
    <div v-if="student_selected">
      <div class="m-menu">
        <div class="m-menu__left">
          <v-btn icon @click="student_selected = null">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>
      <Student :student="student_selected" />
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";

import Student from "./Student";

export default {
  props: {
    students: Array,
  },
  data: () => ({
    student_search: "",
    student_selected: null,
    crt: null,
  }),
  mounted() {
    let ctx = document.getElementById("crt").getContext("2d");
    this.crt = new Chart(ctx, {
      type: "bar",
      options: {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 11,
                stepSize: 1,
              },
            },
          ],
        },
      },
    });
    this.updateChartLS();
  },
  watch: {
    students() {
      if (this.crt) this.updateChartLS();
    },
  },
  computed: {
    students_filtered() {
      return this.students.filter(
        (s) =>
          s.first_name
            .toLowerCase()
            .includes(this.student_search.toLowerCase()) ||
          s.last_name.toLowerCase().includes(this.student_search.toLowerCase())
      );
    },
  },
  methods: {
    updateChartLS() {
      let length = 0;
      let procesamiento_activo = 0;
      let procesamiento_reflexivo = 0;
      let percepcion_sensorial = 0;
      let percepcion_intuitivo = 0;
      let entrada_visual = 0;
      let entrada_verbal = 0;
      let comprension_secuencial = 0;
      let comprension_global = 0;

      this.students.forEach(({ learning_style }) => {
        if (learning_style) {
          length++;
          if (learning_style.procesamiento === "activo")
            procesamiento_activo += learning_style.procesamiento_valor;
          else procesamiento_reflexivo += learning_style.procesamiento_valor;
          if (learning_style.percepcion === "sensorial")
            percepcion_sensorial += learning_style.percepcion_valor;
          else percepcion_intuitivo += learning_style.percepcion_valor;
          if (learning_style.entrada === "visual")
            entrada_visual += learning_style.entrada_valor;
          else entrada_verbal += learning_style.entrada_valor;
          if (learning_style.comprension === "secuencial")
            comprension_secuencial += learning_style.comprension_valor;
          else comprension_global += learning_style.comprension_valor;
        }
      });

      this.crt.data = {
        labels: [
          "activo",
          "reflexivo",
          "sensorial",
          "intuitivo",
          "visual",
          "verbal",
          "secuencial",
          "global",
        ],
        datasets: [
          {
            label: ["Estilo de Aprendizaje"],
            data: [
              procesamiento_activo / length,
              procesamiento_reflexivo / length,
              percepcion_sensorial / length,
              percepcion_intuitivo / length,
              entrada_visual / length,
              entrada_verbal / length,
              comprension_secuencial / length,
              comprension_global / length,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      this.crt.update();
    },
  },
  components: {
    Student,
  },
};
</script>

<style lang='scss' scoped>
.search {
  padding-right: 16px;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);

  display: flex;
  justify-content: space-between;
  align-items: center;
  input[type="text"] {
    width: 100%;
    padding: 12px 16px;

    &:focus {
      outline: none;
    }
  }
}

.student {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  &:active {
    background: rgba(0, 0, 0, 0.15);
  }
  &__name {
    font-size: 0.9rem;
    display: flex;
    align-items: center;
  }
  &__body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>