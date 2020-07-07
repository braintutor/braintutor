<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect(); getEvaluations()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <p class="menu-title">{{evaluation.name}}</p>
      </div>
    </div>
    <div class="results m-card">
      <table class="m-table">
        <thead>
          <tr>
            <th class="text-left">Nombres</th>
            <th class="text-left">Apellidos</th>
            <th class="text-left">Usuario</th>
            <th class="text-left">Puntaje</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, s_idx) in students" :key="s_idx">
            <td>{{student.first_name}}</td>
            <td>{{student.last_name}}</td>
            <td>{{student.username}}</td>
            <td v-if="student.score != null">{{student.score}}</td>
            <td v-else>
              <span class="no-result">Sin realizar</span>
            </td>
            <td class="text-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    :disabled="!student.score"
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="dialog_delete = true; student_result_delete = student"
                  >
                    <v-icon>mdi-playlist-remove</v-icon>
                  </v-btn>
                </template>
                <span style="font-size: .75rem">Eliminar Nota</span>
              </v-tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="results-chart m-card">
      <canvas id="myChart"></canvas>
    </div>

    <!-- Dialog Delete -->
    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina la nota actual, el alumno podrá realizar el examen otra vez.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn
            small
            depressed
            color="error"
            @click="dialog_delete = false; removeResult()"
          >Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Chart from "chart.js";
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getStudentsBySession } from "@/services/studentService";
import { getEvaluation, removeResult } from "@/services/evaluationService";
import { format_two_digits } from "@/services/date.js";

export default {
  props: ["evaluation_id", "getEvaluations", "unselect"],
  data: () => ({
    evaluation: {},
    results: {},
    students: [],
    student_result_delete: null,
    myChart: null,
    //
    loading: true,
    loading_message: "",
    dialog_delete: false
  }),
  async mounted() {
    let session_id = getParam("session_id");
    this.loading_message = "Cargando Resultados";
    this.evaluation = await getEvaluation(this.evaluation_id);
    this.loading_message = "Cargando Alumnos";
    this.students = await getStudentsBySession(session_id);
    this.students.forEach(student => {
      let { score } = (this.evaluation.results || [])[student._id.$oid] || {};
      student.score = score != null ? this.format(score) : null;
    });
    //
    var ctx = document.getElementById("myChart").getContext("2d");
    this.myChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...Array(21).keys()],
        datasets: [
          {
            label: ["Alumnos"],
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
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
                max: this.students.length,
                stepSize: 1
              }
            }
          ]
        }
      }
    });
    this.updateDashboard();
    this.loading = false;
  },
  methods: {
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      score = ("0" + score).slice(-2);
      return score;
    },
    async removeResult() {
      this.loading = true;
      this.loading_message = "Eliminando Resultado";
      await removeResult(
        this.evaluation._id.$oid,
        this.student_result_delete._id.$oid
      );
      this.student_result_delete.score = null;
      this.students.splice();
      this.updateDashboard();
      this.loading = false;
    },
    updateDashboard() {
      let data = this.students.reduce((arr, student) => {
        if (student.score) {
          let score = parseInt(student.score);
          arr[score] += 1;
        }
        return arr;
      }, Array(21).fill(0));
      this.myChart.data.datasets[0].data = data;
      this.myChart.update();
    },
    format(result) {
      let score = Math.round(result * 20);
      score = format_two_digits(score);
      return score;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.results {
  margin: 0 10px;
  padding: 16px 20px;
}
.results-chart {
  margin: 20px 10px;
  padding: 2%;
  canvas {
    margin: 0 auto;
    max-width: 800px;
  }
}

//
.result {
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50%;
}
.no-result {
  color: #acacac;
  border-radius: 10px;
}
</style>