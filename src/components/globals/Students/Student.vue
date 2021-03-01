<template>
  <div>
    <div class="student">
      <h2 class="student__name">
        {{ student.full_name || `${student.last_name}, ${student.first_name}` }}
      </h2>
      <div v-if="student.classroom" class="student__username">
        <strong class="mr-3">Aula:</strong>
        <span>{{ student.classroom }}</span>
      </div>
      <div class="student__email">
        <strong class="mr-3">correo:</strong>
        <span>{{ student.email }}</span>
      </div>
      <div class="student__t">
        <h3>Tiempo de Sesión</h3>
        <p class="mt-2">Ultima Sesión: {{ time.time_last_f }}</p>
        <canvas id="crt-t"></canvas>
      </div>
      <div  class="student__ls">
        <h3>Estilo de Aprendizaje</h3>
        <canvas id="crt-ls"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";

export default {
  props: {
    student: Object,
  },
  watch: {
    student: {
      immediate: true,
      handler: async function(val) {
        if (val && this.crtLS && this.crtT ) this.init();
      },
    },
  },
  data: () => ({
    crtLS: null,
    crtT: null,
    time: {},
    time_size: 7,
  }),
  mounted() {
    this.createChartT()
    this.createChartLS()
    this.init()
  },
  methods: {
    init() {
      console.log("cambiando")
      this.time = this.student.time || {};
      if (this.time.time_last) {
        this.time.time_last_f = this.formatDate(
          new Date(this.time.time_last.$date || this.time.time_last).addHours(5)
        );
      }
      this.showChartT();
      this.showChartLS();
    },
    createChartT() {
      let ctx = document.getElementById("crt-t").getContext("2d");
      this.crtT = new Chart(ctx, {
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
                  stepSize: 1,
                },
              },
            ],
          },
        },
      });
    },
    processDate() {
      let date = new Date();
      date.setDate(date.getDate() - this.time_size);

       return  [...Array(this.time_size)].map(() => {
        date.setDate(date.getDate() + 1);
        let month = date.getMonth() + 1;
        let day = date.getDate();
        month = month > 9 ? month : "0" + month;
        day = day > 9 ? day : "0" + day;
        return {
          name: `${day}-${month}-${date.getFullYear()}`,
          key: `${date.getFullYear()}-${month}-${day}`,
        };
      });
    },
    showChartT() {
      // process
      // CREATING
      // UPDATING
      this.updateChartT();
    },
    updateChartT() {
      let { time } = this.student;
      let dates = this.processDate()
      this.crtT.data = {
        labels: dates.map(({ name }) => name),
        datasets: time
          ? [
              {
                label: ["Tiempo de Sesión (min)"],
                data: dates.map(({ key }) => time[key] / 60),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ]
          : [],
      };
      this.crtT.update();
    },
    createChartLS() {
      let ctx = document.getElementById("crt-ls").getContext("2d");
      this.crtLS = new Chart(ctx, {
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
    },
    updateChartLS() {
      let { learning_style  } = this.student;
      learning_style = learning_style || {}
      let {
        procesamiento,
        procesamiento_valor,
        percepcion,
        percepcion_valor,
        entrada,
        entrada_valor,
        comprension,
        comprension_valor,
      } = learning_style;
      this.crtLS.data = {
        labels: [procesamiento, percepcion, entrada, comprension],
        datasets: [
          {
            label: ["Estilo de Aprendizaje"],
            data: [
              procesamiento_valor,
              percepcion_valor,
              entrada_valor,
              comprension_valor,
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      };
      this.crtLS.update();
    },
    showChartLS() {
   
      // UPDATING
      this.updateChartLS();
    },
  },
};
</script>

<style lang="scss" scoped>
.student {
  max-width: 750px;
  margin: 0 auto;
  padding: 10px;

  &__name {
    font-size: 1.8rem;
    font-weight: bold;
  }
  &__username {
    font-size: 1.1rem;
    margin-top: 10px;
  }
  &__email {
    font-size: 1.1rem;
    margin-top: 10px;
  }
  &__t {
    margin-top: 40px;
    text-align: center;
  }
  &__ls {
    margin-top: 40px;
    text-align: center;
  }
}

canvas {
  margin: 0 auto;
  margin-top: 10px;
}
</style>
