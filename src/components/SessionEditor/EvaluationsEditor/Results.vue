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
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, s_idx) in students" :key="s_idx">
            <td>{{student.first_name}}</td>
            <td>{{student.last_name}}</td>
            <td>{{student.user}}</td>
            <td v-if="student.score">
              <span class="result">{{student.score}}</span>
            </td>
            <td v-else>
              <span class="no-result">Sin realizar</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="results-chart m-card">
      <canvas id="myChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";
import { getStudentsBySession } from "@/services/studentService";

export default {
  props: ["evaluation", "getEvaluations", "unselect"],
  data: () => ({
    results: {},
    students: [],
    myChart: null,
    //
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    let session_id = getParam("session_id");
    this.loading_message = "Cargando Alumnos";
    this.students = await getStudentsBySession(session_id);
    this.students.forEach(student => {
      student.result = this.evaluation.results[student._id.$oid];
      student.score =
        student.result && student.result.started
          ? this.calculate(student.result)
          : null;
    });
    this.showDashboard();
    this.loading = false;
  },
  methods: {
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      score = ("0" + score).slice(-2);
      return score;
    },
    showDashboard() {
      let data = this.students.reduce((arr, student) => {
        if (student.score) {
          let score = parseInt(student.score);
          arr[score] += 1;
        }
        return arr;
      }, Array(21).fill(0));

      if (this.myChart) this.myChart.destroy();
      var ctx = document.getElementById("myChart").getContext("2d");
      this.myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: [...Array(21).keys()],
          datasets: [
            {
              label: ["Alumnos"],
              data,
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