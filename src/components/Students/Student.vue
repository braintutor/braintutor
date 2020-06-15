<template>
  <div>
    <Menu :title="student.name" :back="unselect" />

    <div class="m-card mt-3 pa-3">
      <p class="text-center">Estilo de Aprendizaje</p>
      <div v-show="student.learning_style" class="crt">
        <canvas id="crt-ls"></canvas>
      </div>
      <p
        v-show="!student.learning_style"
        class="text-center"
        style="color: #b7b7b7"
      >No hay información</p>
    </div>

    <div class="m-card mt-3 pa-3">
      <p class="text-center">Tiempo de Sesión (min)</p>
      <div v-show="student.time" class="crt">
        <canvas id="crt-t"></canvas>
      </div>
      <p v-show="!student.time" class="text-center" style="color: #b7b7b7">No hay información</p>
    </div>
  </div>
</template>

<script>
import Menu from "@/components/Menu";
import Chart from "chart.js";

export default {
  props: ["student", "unselect"],
  data: () => ({
    crtLs: null,
    crtT: null
  }),
  components: {
    Menu
  },
  created() {
    this.student.name = `${this.student.last_name}, ${this.student.first_name}`;
  },
  mounted() {
    this.showDashboard();
    this.showDashboardTime();
  },
  methods: {
    showDashboard() {
      let { learning_style } = this.student;
      if (learning_style) {
        // CREATING
        let ctx = document.getElementById("crt-ls").getContext("2d");
        this.crtLs = new Chart(ctx, {
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

        // UPDATING
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
        this.crtLs.data = {
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
        this.crtLs.update();
      }
    },
    showDashboardTime() {
      let { time } = this.student;
      if (time) {
        delete time["time_last"];

        // CREATING
        let ctx = document.getElementById("crt-t").getContext("2d");
        this.crtT = new Chart(ctx, {
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
                    stepSize: 1
                  }
                }
              ]
            }
          }
        });

        // UPDATING
        let limit = 5;
        let keys = Object.keys(time);
        let values = Object.values(time).map(t => t / 60);
        keys = keys.slice(Math.max(keys.length - limit, 0), keys.length);
        values = values.slice(
          Math.max(values.length - limit, 0),
          values.length
        );

        this.crtT.data = {
          labels: keys,
          datasets: [
            {
              label: ["Tiempo de Sesión (min)"],
              data: values,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1
            }
          ]
        };
        this.crtT.update();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.crt {
  margin: 0 auto;
  max-width: 540px;
}
</style>