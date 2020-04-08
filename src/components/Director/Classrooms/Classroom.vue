<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselect(); getClassrooms()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <p class="menu-title">{{classroom.name}}</p>
      </div>
    </div>
    <div class="no-session" v-if="sessions.length <= 0">No hay cursos asignados.</div>
    <div class="session m-card" v-for="(session, s_idx) in sessions" :key="s_idx">
      <p class="session__item">Curso</p>
      <p class="session__value">{{session.course.name}}</p>
      <p class="session__item">Profesor</p>
      <p class="session__value">{{`${session.teacher.first_name} ${session.teacher.last_name}`}}</p>
      <p
        v-if="session.evaluations && session.evaluations.length > 0"
        class="session__item"
      >Evaluaciones</p>
      <div class="session__chart" v-show="session.loading">Cargando...</div>
      <div
        class="session__chart"
        v-show="!session.loading"
        v-for="(evaluation, e_idx) in session.evaluations"
        :key="e_idx"
      >
        <p>{{evaluation.name}}</p>
        <div class="session__chart-canvas">
          <canvas :id="evaluation._id.$oid + e_idx" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getSessionsByClassroom } from "@/services/sessionService";
import { getEvaluationsBySessionDirector } from "@/services/evaluationService";
import { getStudentsByClassroomDirector } from "@/services/studentService";
import Chart from "chart.js";

export default {
  props: ["classroom", "getClassrooms", "unselect"],
  data: () => ({
    sessions: [],
    students: [],
    loading: true,
    loading_message: ""
  }),
  async mounted() {
    Chart.defaults.global.responsive = true;
    this.loading_message = "Cargando Cursos";
    this.sessions = await getSessionsByClassroom(this.classroom._id.$oid);
    this.students = await getStudentsByClassroomDirector(
      this.classroom._id.$oid
    );
    this.loading = false;
    for (let session of this.sessions) {
      session.loading = true;
      session.evaluations = await getEvaluationsBySessionDirector(
        session._id.$oid
      );
      session.loading = false;
      this.sessions.splice();
      //
      session.evaluations.forEach((evaluation, e_idx) => {
        let scores = [];
        if (evaluation.results) {
          this.students.forEach(student => {
            let result = evaluation.results[student._id.$oid];
            if (result && result.started) scores.push(this.calculate(result));
          });
        }
        let data = scores.reduce((arr, score) => {
          arr[score] += 1;
          return arr;
        }, Array(21).fill(0));
        setTimeout(() => {
          this.showDashboard(evaluation._id.$oid + e_idx, data);
        }, 1000);
      });
    }
  },
  methods: {
    calculate(result) {
      let score = Math.round((20 * result.corrects) / result.total) || 0;
      return score;
    },
    showDashboard(id, data) {
      let ctx = document.getElementById(id).getContext("2d");
      new Chart(ctx, {
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
.session {
  padding: 2%;
  margin: 0 10px 14px;
  &__item {
    margin: 8px;
    margin-top: 0;
    font-weight: bold;
  }
  &__value {
    margin-bottom: 20px;
    padding: 6px 12px;
    background: #f3f3f3;
    font-weight: lighter;
    border-radius: 10px;
  }
  &__chart {
    padding: 2%;
    margin-bottom: 2%;
    border: 2px solid #e9e9e9;
    text-align: center;
    font-weight: bold;
    border-radius: 10px;
    &-canvas {
      margin: 0 auto;
      max-width: 700px;
    }
  }
}
.no-session {
  color: #acacac;
  text-align: center;
}
</style>