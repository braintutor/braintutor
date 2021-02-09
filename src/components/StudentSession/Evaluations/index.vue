<template>
  <div class="m-container">
    <div v-show="!evaluation_to_start">
      <div class="header">
        <span class="header__name">Nombre</span>
        <span class="header__name">Inicio</span>
        <span class="header__name">Fin</span>
        <span class="header__name">Nota</span>
        <v-btn style="opacity: 0; pointer-events: none'" color="primary" icon>
          <v-icon>mdi-arrow-right-drop-circle</v-icon>
        </v-btn>
      </div>
      <div
        v-for="(item, idx) in evaluations_filtered"
        :key="idx"
        @click="
          dlg_start = true;
          evaluation_selected = item;
        "
        class="evaluation mb-2"
        :class="{ 'evaluation--disabled': !isAvailable(item) }"
      >
        <span class="evaluation__name">{{ item.name }}</span>
        <span class="evaluation__date">{{ toDate(item.time_start) }}</span>
        <span class="evaluation__date">{{ toDate(item.time_end) }}</span>
        <span class="evaluation__score">{{ getScore(item) }}</span>
        <v-btn
          :style="isAvailable(item) ? '' : 'opacity: 0; pointer-events: none'"
          color="primary"
          icon
        >
          <v-icon>mdi-arrow-right-drop-circle</v-icon>
        </v-btn>
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
            <p class="mt-4">No cierres la pestaña o cambies de página.</p>
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
    </div>

    <Evaluation
      v-if="evaluation_to_start"
      :evaluation="evaluation_to_start"
      :unselect="
        () => {
          evaluation_to_start = null;
          init();
        }
      "
    />
  </div>
</template>

<script>
import Evaluation from "./Evaluation";
import {
  getEvaluationsBySessionStudent,
  getEvaluationByStudent,
} from "@/services/evaluationService";

export default {
  data: () => ({
    evaluations: [],
    results: [],
    evaluation_selected: null,
    evaluation_to_start: null,
    //
    dlg_start: false,
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

      this.showLoading("Cargando Evaluaciones");
      try {
        this.evaluations = this.mongoArr(
          await getEvaluationsBySessionStudent(session_id)
        );
        this.results = (
          await this.$api.evaluation.getSessionResults(session_id)
        ).results;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async startEvaluation(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        this.evaluation_to_start = await getEvaluationByStudent(evaluation._id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    getScore(evaluation) {
      let result = this.results.find(
        (result) => result.evaluation.id === evaluation._id
      );
      if (result) return result.score;
      return "-";
    },
    isAvailable(evaluation) {
      return new Date() < evaluation.time_end;
    },
    //
    toDate(date) {
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
  },
};
</script>

<style lang='scss' scoped>
$grid-template-columns: 1fr 0.75fr 0.75fr 0.5fr auto;

.header {
  padding: 0 20px;
  font-size: 1rem;
  display: grid;
  grid-template-columns: $grid-template-columns;

  &__name {
    font-weight: bold;
  }
}

.evaluation {
  padding: 10px 20px;
  font-size: 0.9rem;
  background: #e8e8ff;
  border-radius: 12px;
  transition: 0.3s;
  cursor: pointer;
  display: grid;
  grid-template-columns: $grid-template-columns;
  align-items: center;

  &__name {
    font-weight: bold;
  }

  &__score {
    font-weight: bold;
  }

  &:hover {
    background: #e1e1ff;
  }

  &--disabled {
    background: #f7f7f7;
    pointer-events: none;
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