<template>
  <div class="m-container">
    <div>
      <div class="header">
        <span class="header__name">Nombre</span>
        <span class="header__name">Inicio</span>
        <span class="header__name">Fin</span>
      </div>
      <div
        v-for="(item, idx) in evaluations_filtered"
        :key="idx"
        class="evaluation mb-2"
        :class="{ 'evaluation--disabled': !item.isAvailable }"
      >
        <div class="evaluation__body">
          <span class="evaluation__name">{{ item.name }}</span>
          <span class="evaluation__date">{{
            toDateString(item.time_start)
          }}</span>
          <span class="evaluation__date">{{
            toDateString(item.time_end)
          }}</span>
        </div>
        <div
          v-for="(result, r_idx) in item.results"
          :key="r_idx"
          class="result"
        >
          <strong>{{ result.student.full_name }}:</strong>
          <span class="ml-3">{{ result.score || "No hay nota" }}</span>
        </div>
      </div>

      <!-- Dialog Result Comment -->
      <v-dialog v-model="dlg_result" persistent max-width="1200">
        <div class="m-card">
          <div class="m-card__body">
            <div v-if="evaluation_selected" class="close-modal">
              <h3>{{ evaluation_selected.name }}</h3>
              <v-btn class="mx-2" icon small @click="dlg_result = false">
                <v-icon dark> mdi-close-thick </v-icon>
              </v-btn>
            </div>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_result = false" small text color="dark"
              >Cerrar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    evaluations: [],
    evaluation_selected: null,
    result_selected: null,
    //
    dlg_result: false,
  }),
  computed: {
    evaluations_filtered() {
      let evaluations = this.evaluations.map((e) => ({
        ...e,
        time_start: new Date(e.time_start + "Z"),
        time_end: new Date(e.time_end + "Z"),
      }));
      evaluations.sort((a, b) => b.time_start - a.time_start);
      return evaluations;
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      let session_id = this.$route.params["session_id"];
      this.evaluations = [];

      this.showLoading("Cargando Evaluaciones");
      try {
        let evaluations = await this.$api.evaluation.getAll(session_id);
        let results = await this.$api.evaluation.getSessionResults(session_id);

        evaluations.forEach((evaluation) => {
          evaluation.results = this.getResults(evaluation, results);
          evaluation.isAvailable = this.isAvailable(evaluation);
        });

        this.evaluations = evaluations;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async showResult(evaluation) {
      this.showLoading("Cargando Resultados");
      try {
        this.evaluation_selected = this.mongo(
          await this.$api.evaluation.takeExam(evaluation.id)
        );
        this.dlg_result = true;
        this.result_selected = evaluation.result;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    getResults(evaluation, results) {
      results = results.filter(
        (result) => result.evaluation.id === evaluation.id
      );
      return results;
    },
    isAvailable({ time_end }) {
      if (new Date() >= time_end) return false;
      return true;
    },
    //
    toDateString(date) {
      let date_format = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      return date_format;
    },
  },
};
</script>

<style lang='scss' scoped>
$grid-template-columns: 4fr 3fr 3fr;

.header {
  padding: 12px 20px;
  font-size: 1rem;
  display: grid;
  grid-template-columns: $grid-template-columns;

  &__name {
    font-weight: bold;
  }
}

.evaluation {
  overflow: hidden;
  font-size: 0.9rem;
  border-radius: 12px;
  border: 2px solid #e8e8ff;
  background: #e8e8ff;

  &__body {
    padding: 12px 20px;

    display: grid;
    grid-template-columns: $grid-template-columns;
    align-items: center;
  }

  &__name {
    font-weight: bold;
  }

  &__score {
    font-weight: bold;
  }

  &__options {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &--disabled {
    background: #f7f7f7;
    .evaluation__name,
    .evaluation__date {
      color: #8a8a8a;
    }
  }
}

.result {
  padding: 12px 20px;
  background: #fff;
}

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>