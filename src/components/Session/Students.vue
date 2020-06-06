<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <div class="students m-card">
      <h1 class="students__title">Alumnos</h1>
      <div class="students__content">
        <table class="m-table">
          <thead>
            <tr>
              <th class="text-left">Nombres</th>
              <th class="text-left">Apellidos</th>
              <th class="text-left">Usuario</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entity, e_idx) in students" :key="e_idx">
              <td>{{ entity.first_name }}</td>
              <td>{{ entity.last_name }}</td>
              <td>{{ entity.user }}</td>
              <td class="text-center">
                <v-btn :disabled="!entity.learning_style" small icon @click="student = entity">
                  <v-icon>mdi-chart-bar</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-center mt-2" v-show="students.length === 0">No hay alumnos.</p>
      </div>
    </div>
    <div v-show="student" class="students-chart m-card">
      <p v-if="student" class="students-chart__title">Estilo de Aprendizaje</p>
      <p
        v-if="student"
        class="students-chart__subtitle"
      >{{`${student.first_name} ${student.last_name}`}}</p>
      <canvas id="chart"></canvas>
    </div>
    <div class="students-chart m-card">
      <p class="students-chart__title">Estilo de Aprendizaje</p>
      <p class="students-chart__subtitle">(Promedio)</p>
      <canvas id="chartAll"></canvas>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";
import Chart from "chart.js";

import { getParam } from "@/services/router.js";
import { getStudentsBySessionStudent } from "@/services/studentService";

export default {
  data: () => ({
    session_id: "",
    students: [],
    student: null,
    //
    show_dashboard: false,
    loading: true,
    loading_message: ""
  }),
  watch: {
    student() {
      this.showDashboard(this.student.learning_style);
    }
  },
  async mounted() {
    this.session_id = getParam("session_id");
    this.loading_message = "Cargando Alumnos";
    this.students = await getStudentsBySessionStudent(this.session_id);
    this.loading = false;
    // Chart
    this.showDashboardAll();
    var ctx = document.getElementById("chart").getContext("2d");
    this.chart = new Chart(ctx, {
      type: "bar",
      options: {
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: 11,
                stepSize: 1
              }
            }
          ]
        }
      }
    });
  },
  methods: {
    showDashboard(learning_style) {
      if (learning_style) {
        this.show_dashboard = true;
        let {
          procesamiento,
          procesamiento_valor,
          percepcion,
          percepcion_valor,
          entrada,
          entrada_valor,
          comprension,
          comprension_valor
        } = learning_style;
        this.chart.data = {
          labels: [procesamiento, percepcion, entrada, comprension],
          datasets: [
            {
              label: ["Estilo de Aprendizaje"],
              data: [
                procesamiento_valor,
                percepcion_valor,
                entrada_valor,
                comprension_valor
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)"
              ],
              borderWidth: 1
            }
          ]
        };
        this.chart.update();
      } else {
        this.show_dashboard = false;
      }
    },
    showDashboardAll() {
      let students_length = 0;
      let data = this.students.reduce(
        (arr, student) => {
          let ls = student.learning_style;
          if (ls) {
            students_length++;
            arr[ls.procesamiento] += ls.procesamiento_valor;
            arr[ls.percepcion] += ls.percepcion_valor;
            arr[ls.entrada] += ls.entrada_valor;
            arr[ls.comprension] += ls.comprension_valor;
          }
          return arr;
        },
        {
          activo: 0,
          reflexivo: 0,
          sensorial: 0,
          intuitivo: 0,
          verbal: 0,
          visual: 0,
          secuencial: 0,
          global: 0
        }
      );
      Object.keys(data).forEach(key => {
        data[key] /= students_length;
      });
      var ctx_ = document.getElementById("chartAll").getContext("2d");
      this.chartAll = new Chart(ctx_, {
        type: "bar",
        data: {
          labels: [
            "activo",
            "reflexivo",
            "sensorial",
            "intuitivo",
            "verbal",
            "visual",
            "secuencial",
            "global"
          ],
          datasets: [
            {
              label: ["Estilo de Aprendizaje"],
              data: Object.values(data),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(75, 192, 192, 0.2)"
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(75, 192, 192, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 11,
                  stepSize: 1
                }
              }
            ]
          }
        }
      });
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.students {
  padding: 16px 24px;
  margin-bottom: 1.2rem;
  &__title {
    margin: 0 0 6px 0;
    font-size: 1.4rem;
  }
  &__content {
    overflow-x: auto;
  }
}
.students-chart {
  padding: 2%;
  margin-bottom: 1.2rem;
  &__title {
    margin-bottom: 6px;
    text-align: center;
    font-weight: bold;
    font-size: 1.2rem;
  }
  &__subtitle {
    color: #8d8d8d;
    text-align: center;
    font-weight: bold;
    font-size: 1.1rem;
  }
  canvas {
    display: block;
    margin: 10px auto 0 auto;
    max-width: 600px;
  }
}
</style>