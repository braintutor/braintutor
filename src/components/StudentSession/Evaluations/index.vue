<template>
  <div class="m-container">
    <div v-show="!evaluation_to_start">
      <div class="header">
        <span class="header__name">Nombre</span>
        <span class="header__name">Inicio</span>
        <span class="header__name">Fin</span>
        <span class="header__name">Nota</span>
      </div>
      <div
        v-for="(item, idx) in evaluations_filtered"
        :key="idx"
        class="evaluation mb-2"
        :class="{ 'evaluation--disabled': !item.isAvailable }"
      >
        <span class="evaluation__name">{{ item.name }}</span>
        <span class="evaluation__date">{{
          toDateString(item.time_start)
        }}</span>
        <span class="evaluation__date">{{ toDateString(item.time_end) }}</span>
        <span v-if="item.result" class="evaluation__score">{{
          item.result.score || "-"
        }}</span>
        <span v-else>-</span>
        <div class="evaluation__options">
          <v-tooltip
            v-if="item.result && item.result.is_score_published"
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                @click="showResult(item)"
                v-on="on"
                color="primary"
                icon
                small
              >
                <v-icon style="font-size: 1.3rem">mdi-eye</v-icon>
              </v-btn>
            </template>
            <span style="font-size: 0.75rem">Ver Resultados</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-if="item.isAvailable" v-slot:activator="{ on }">
              <v-btn
                @click="
                  dlg_start = true;
                  evaluation_selected = item;
                "
                v-on="on"
                color="primary"
                icon
                small
                class="ml-2"
              >
                <v-icon style="font-size: 1.3rem"
                  >mdi-arrow-right-drop-circle</v-icon
                >
              </v-btn>
            </template>
            <span style="font-size: 0.75rem">Ingresar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-if="!item.isAvailable" v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                color="primary"
                icon
                small
                class="ml-2"
                style="cursor: initial"
              >
                <v-icon v-on="on" style="font-size: 1.3rem">mdi-check</v-icon>
              </v-btn>
            </template>
            <span style="font-size: 0.75rem">Finalizado</span>
          </v-tooltip>
        </div>
      </div>
      <!-- Dialog Start Evaluation -->
      <v-dialog v-model="dlg_start" persistent max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <div class="close-modal">
              <h3>Iniciar Evaluación</h3>
              <v-btn class="mx-2" icon small @click="dlg_start = false">
                <v-icon dark> mdi-close-thick </v-icon>
              </v-btn>
            </div>
            <p class="mt-4">
              Una vez que inicias una evaluación, solo tendrás una oportunidad
              para responderla.
            </p>
            <!-- <p class="mt-4">No cierres la pestaña o cambies de página.</p> -->
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_start = false" small text color="dark"
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                dlg_start = false;
                startEvaluation(evaluation_selected);
              "
              color="primary"
              small
              class="ml-2"
              >Iniciar</m-btn
            >
          </div>
        </div>
      </v-dialog>
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
            <EvaluationResult
              v-if="evaluation_selected && result_selected"
              :evaluation="evaluation_selected"
              :result="result_selected"
            />
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_result = false" small text color="dark"
              >Cerrar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>
    <Evaluation
      v-if="evaluation_to_start"
      :evaluation="evaluation_to_start"
      @onExit="
        evaluation_to_start = null;
        init();
      "
    />
  </div>
</template>

<script>
import Evaluation from "./Evaluation";
import EvaluationResult from "./EvaluationResult";

export default {
  data: () => ({
    evaluations: [],
    evaluation_selected: null,
    evaluation_to_start: null,
    result_selected: null,
    //
    dlg_start: false,
    dlg_result: false,
  }),
  computed: {
    evaluations_filtered() {
      let evaluations = this.evaluations.map((e) => e);
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
          evaluation.result = this.getResult(evaluation, results);
          evaluation.isAvailable = this.isAvailable(evaluation);
        });

        this.evaluations = evaluations;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async startEvaluation(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        this.evaluation_to_start = this.mongo(
          await this.$api.evaluation.takeExam(evaluation.id)
        );
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
    getResult(evaluation, results) {
      let result = results.find(
        (result) => result.evaluation.id === evaluation.id
      );
      return result;
    },
    isAvailable({ result, time_end }) {
      if (result && result.time_end) return false;
      if (new Date() >= new Date(time_end + "Z")) return false;
      return true;
    },
    //
    toDateString(date) {
      date = new Date(date + "Z");
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
  components: {
    Evaluation,
    EvaluationResult,
  },
};
</script>

<style lang='scss' scoped>
$grid-template-columns: 4fr 3fr 3fr 1fr 100px;

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
  padding: 12px 20px;
  font-size: 0.9rem;
  background: #e8e8ff;
  border-radius: 12px;
  transition: 0.3s;
  display: grid;
  grid-template-columns: $grid-template-columns;
  align-items: center;

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

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>