<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <div v-show="!student">
      <div class="students m-card">
        <h1 class="students__title">Alumnos</h1>
        <div class="students__content">
          <table class="m-table">
            <thead>
              <tr>
                <th class="text-left">Nombres</th>
                <th class="text-left">Apellidos</th>
                <th class="text-left">Usuario</th>
                <th class="text-left">Correo</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="student pa-4"
                v-for="(entity, e_idx) in students"
                :key="e_idx"
                @click="select(entity)"
              >
                <td>{{ entity.first_name }}</td>
                <td>{{ entity.last_name }}</td>
                <td>{{ entity.username }}</td>
                <td>{{ entity.email }}</td>
              </tr>
            </tbody>
          </table>
          <p class="text-center mt-2" v-show="students.length === 0">No hay alumnos.</p>
        </div>
      </div>

      <div class="students-chart m-card">
        <p class="students-chart__title">Estilo de Aprendizaje</p>
        <p class="students-chart__subtitle">(Promedio)</p>
        <canvas id="chartAll"></canvas>
      </div>
    </div>

    <Student v-if="student" :student="student" :unselect="unselect" />
  </div>
</template>

<script>
import loading from "@/components/loading";
import Student from "./Student";
import Chart from "chart.js";

// import { getParam } from "@/services/router.js";

export default {
  props: ["get"],
  data: () => ({
    session_id: "",
    students: [],
    student: null,
    //
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    await this.update();
  },
  methods: {
    select(student) {
      this.student = student;
    },
    unselect() {
      this.student = null;
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
    },
    async update() {
      this.loading = true;
      this.loading_message = "Cargando Alumnos";
      this.students = await this.get();
      this.student = null;
      this.showDashboardAll();
      this.loading = false;
    }
  },
  components: {
    loading,
    Student
  }
};
</script>

<style lang='scss' scoped>
.students {
  padding: 16px 24px;
  margin: 0 0 10px 0;
  &__title {
    margin: 0;
    margin-bottom: 6px;
    font-size: 1.4rem;
  }
  &__content {
    overflow-x: auto;
  }
}
.student {
  cursor: pointer;
  &:hover {
    box-shadow: -3px 1px 4px #ccc;
  }
}
.students-chart {
  padding: 2%;
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
    font-size: 0.9rem;
  }
  canvas {
    display: block;
    margin: 10px auto 0 auto;
    max-width: 600px;
  }
}
</style>