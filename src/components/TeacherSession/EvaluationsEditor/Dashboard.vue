<template>
  <div style="height: 100%">
    <div v-show="!show_editor && !show_results" class="list m-container">
      <!-- MENU -->
      <div class="list__menu">
        <m-btn @click="create()" color="primary" small>
          <v-icon left style="font-size: 0.9rem">mdi-plus</v-icon>
          {{ createTitle }}</m-btn
        >
      </div>
      <!-- EVALUATIONS -->
      <EvaluationList 
        :evaluations="evaluations_filtered"
        @edit="showEditor"
        @showResults="showResults"
        @updateTime="showUpdateTime"
        @remove="showRemove"
      ></EvaluationList> 
      <!-- DLG REMOVE -->
      <v-dialog v-model="dlg_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <div class="close-modal">
              <h3>¿Desea eliminar?</h3>
              <v-btn class="mx-2" icon small @click="dlg_remove = false">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </div>
            <p class="mt-4">
              Se borrarán también los resultados de los alumnos.
            </p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_remove = false" class="cancel-button" small
              >Cancelar</m-btn
            >
            <m-btn
              @click="remove(evaluation_selected)"
              color="error"
              small
              class="ml-2"
              >Eliminar</m-btn
            >
          </div>
        </div>
      </v-dialog>
      <!-- DLG UPDATE TIME -->
      <v-dialog v-model="dlg_update_time" max-width="450" persistent>
        <div class="m-card">
          <div class="m-card__body">
            <div class="close-modal">
              <h3>Modificar Tiempo</h3>
              <v-btn class="mx-2" icon small @click="dlg_update_time = false">
                <v-icon>mdi-close-thick</v-icon>
              </v-btn>
            </div>
            <div v-if="evaluation_selected" class="mt-4">
              <span class="mr-4">Tiempo de Fin:</span>
              <date-time v-model="evaluation_selected.time_end" />
            </div>
          </div>
          <div class="m-card__actions">
            <m-btn
              @click="dlg_update_time = false"
              class="cancel-button"
              small
              text
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                dlg_update_time = false;
                updateTime(evaluation_selected);
              "
              color="primary"
              small
              class="ml-2"
              >Guardar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>
    <!-- EVALUATION EDITOR -->
    <EvaluationEditor
      v-if="show_editor"
      :evaluation="evaluation_selected"
      @onClose="
        show_editor = false;
        init();
      "
    />
    <!-- EVALUATION RESULTS -->
    <div v-if="show_results" class="m-container">
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="show_results = false">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">{{ evaluation_selected.name }}</span>
        </div>
      </div>
      <EvaluationResults :evaluation="evaluation_selected"  :role="'TEA'" />
    </div>
  </div>
</template>

<script>
import EvaluationList from "./List";
import EvaluationEditor from "./Editor";
import EvaluationResults from "./EvaluationResults";
import DateTime from "@/components/globals/DateTime";
import { getStudentsBySession } from "@/services/studentService";

export default {
    props: {
        createTitle: String,
        type: String
    },
  data: () => ({
    session_id: "",
    evaluations: [],
    evaluation_selected: null,
    //
    show_editor: false,
    show_results: false,
    dlg_remove: false,
    dlg_update_time: false,
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
    this.session_id = this.$route.params["session_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.evaluations = [];

      this.showLoading("Cargando Evaluaciones");
      try {
        this.evaluations = await this.$api.evaluation.getAll(this.session_id, this.type);
        this.students = this.mongoArr(
          await getStudentsBySession(this.session_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async create() {
      let now = () => {
        let date = new Date();
        date.setSeconds(0, 0);
        return date;
      };

      let new_evaluation = {
        name: "Nombre",
        time_start: now().addHours(1),
        time_end: now().addHours(2),
        map_score_to_note: [],
        type: this.type,  
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa", "Alternativa"],
            correct: 0,
            score: 0,
            type: "closed",
          },
        ],
      };

      this.showLoading("Creando Evaluación");
      try {
        let { id } = await this.$api.evaluation.add({
          session: this.session_id,
          ...new_evaluation,
        });
        new_evaluation.id = id;
        await this.showEditor(new_evaluation);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async remove(evaluation) {
      this.dlg_remove = false;
      this.showLoading("Eliminando");
      try {
        await this.$api.evaluation.remove(evaluation.id);
        this.evaluations = this.evaluations.filter(
          (e) => e.id !== evaluation.id
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async updateTime(evaluation) {
      this.showLoading("Guardando Cambios");
      try {
        await this.$api.evaluation.updateTime(evaluation.id, evaluation);
        await this.init();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    //
    async showEditor(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        this.evaluation_selected = this.mongo(
          await this.$api.evaluation.get(evaluation.id)
        );
        this.show_editor = true;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async showResults(evaluation) {
      this.showLoading("Cargando Evaluación");
      try {
        this.evaluation_selected = evaluation
        this.show_results = true;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showRemove(evaluation) {
      this.evaluation_selected = evaluation;
      this.dlg_remove = true;
    },
    showUpdateTime(evaluation) {
      this.evaluation_selected = Object.assign({}, evaluation);
      this.dlg_update_time = true;
    },
    // TODO: add
    // async removeResult() {
    //   this.showLoading("Eliminando Resultado");
    //   let student_id = this.student_selected._id;
    //   try {
    //     await removeResult(this.evaluation._id, student_id);
    //     this.evaluation.results = this.evaluation.results.filter(
    //       (result) => result._id !== student_id
    //     );
    //     this.$refs.evaluation_results.init();
    //   } catch (error) {
    //     this.showMessage("", error.msg || error);
    //   }
    //   this.hideLoading();
    // },
  },
  components: {
    EvaluationEditor,
    EvaluationResults,
    DateTime,
    EvaluationList
  },
};
</script>

<style lang='scss' scoped>
.list {
  &__menu {
    display: flex;
    justify-content: flex-end;
  }
}
</style>