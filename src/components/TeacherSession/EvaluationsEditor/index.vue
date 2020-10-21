<template>
  <div class="m-container">
    <div v-if="!evaluation">
      <!-- MENU -->
      <div class="evaluations__menu mb-3">
        <strong
          v-show="$store.state.show_limits"
          class="mt-1"
          style="opacity: 0.5"
          >({{
            `${evaluations.length}/${variables.max_evaluations_per_session}`
          }})</strong
        >
        <div></div>
        <m-btn
          @click="create()"
          :disabled="
            evaluations.length >= variables.max_evaluations_per_session
          "
          color="primary"
          small
        >
          <v-icon left style="font-size: 0.9rem">mdi-plus</v-icon>Crear
          Evaluación
        </m-btn>
      </div>
      <!-- EVALUATIONS -->
      <EvaluationCard
        v-for="evaluation in evaluations_filtered"
        :key="evaluation._id"
        :name="evaluation.name"
        :time_start="evaluation.time_start"
        :time_end="evaluation.time_end"
        :isPublic="evaluation.public"
        :items="[
          {
            label: 'N° Preguntas',
            value: `${evaluation.content.length} preguntas`,
          },
        ]"
        :buttons="[
          {
            text: evaluation.public ? 'Ver Evaluación' : 'Editar',
            icon: evaluation.public ? 'mdi-eye' : 'mdi-pencil',
            color: 'primary',
            action: () => {
              select(evaluation);
            },
          },
          {
            text: 'Resultados',
            icon: 'mdi-poll',
            color: 'primary',
            action: () => {
              results(evaluation);
            },
            disabled: !evaluation.public,
          },
          {
            text: 'Modificar Tiempo',
            icon: 'mdi-clock-time-two-outline',
            color: 'success',
            action: () => {
              showUpdateTime(evaluation);
            },
            disabled: !evaluation.public,
          },
          {
            text: 'Eliminar',
            icon: 'mdi-delete',
            color: 'error',
            action: () => {
              dlg_remove = true;
              evaluation_selected = evaluation;
            },
          },
        ]"
        class="mb-3"
      />

      <div class="text-center" v-show="evaluations_filtered.length === 0">
        No hay evaluaciones.
      </div>

      <!-- DLG UPDATE TIME -->
      <v-dialog v-model="dlg_update_time" max-width="450" persistent>
        <div class="m-card">
          <div class="m-card__body">
            <h3>Modificar Tiempo</h3>
            <div v-if="evaluation_selected" class="mt-4">
              <span class="mr-4">Tiempo de Fin:</span>
              <input
                type="datetime-local"
                v-model="evaluation_selected.time_end_f"
              />
            </div>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_update_time = false" color="primary" small text
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                dlg_update_time = false;
                updateTime();
              "
              color="primary"
              small
              class="ml-2"
              >Guardar</m-btn
            >
          </div>
        </div>
      </v-dialog>

      <!-- Dialog Remove -->
      <v-dialog v-model="dlg_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>¿Desea eliminar?</h3>
            <p class="mt-4">
              Se borrarán también los resultados de los alumnos.
            </p>
          </div>
          <div class="m-card__actions">
            <m-btn @click="dlg_remove = false" color="primary" small
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                dlg_remove = false;
                remove();
              "
              color="error"
              small
              class="ml-2"
              >Eliminar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>

    <EvaluationEditor
      v-else-if="edit"
      :evaluation="evaluation"
      :unselect="unselect"
    />

    <!-- EVALUATION RESULTS -->
    <div v-else>
      <div class="m-menu mb-3">
        <div class="m-menu__left">
          <v-btn icon @click="unselect()">
            <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">{{ evaluation.name }}</span>
        </div>
      </div>
      <EvaluationResults
        ref="evaluation_results"
        :evaluation="evaluation"
        :students="students"
        :buttons="[
          {
            text: 'Eliminar Nota',
            action: showRemoveResult,
          },
        ]"
      />
    </div>

    <!-- DLG REMOVE RESULT -->
    <v-dialog v-model="dlg_remove_result" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina la nota actual, el alumno podrá realizar el examen otra
            vez.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove_result = false" color="primary" small
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove_result = false;
              removeResult();
            "
            color="error"
            small
            class="ml-2"
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import EvaluationCard from "@/components/globals/Evaluation/EvaluationCard";
import EvaluationEditor from "./EvaluationEditor";
import EvaluationResults from "@/components/globals/Evaluation/EvaluationResults";

import {
  getEvaluationsBySession,
  addEvaluation,
  deleteEvaluation,
  removeResult,
} from "@/services/evaluationService";
import { getStudentsBySession } from "@/services/studentService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object.js";

import variables from "@/models/variables";

export default {
  data: () => ({
    session_id: "",
    evaluation: null,
    evaluation_selected: null,
    evaluations: [],
    students: [],
    student_selected: null,
    edit: false,
    dlg_update_time: false,
    dlg_remove: false,
    dlg_remove_result: false,
    variables,
  }),
  async mounted() {
    this.session_id = getParam("session_id");
    this.getEvaluations();
  },
  computed: {
    evaluations_filtered() {
      return this.orderObjectsByDate(this.evaluations, "time_start");
    },
  },
  methods: {
    async getEvaluations() {
      this.showLoading("Cargando Evaluaciones");
      try {
        this.evaluations = this.mongoArr(
          await getEvaluationsBySession(this.session_id)
        );
        this.students = this.mongoArr(
          await getStudentsBySession(this.session_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async create() {
      this.showLoading("Creando Evaluación");

      let now = () => {
        let date = new Date();
        date.setSeconds(0, 0);
        return date;
      };

      let new_evaluation = {
        name: "Nombre",
        time_start: now().addHours(1),
        time_end: now().addHours(2),
        content: [
          {
            question: "Pregunta",
            alternatives: ["Alternativa 1", "Alternativa 2"],
            correct: 0,
          },
        ],
      };
      try {
        let evaluation_id = await addEvaluation(
          this.session_id,
          new_evaluation
        );
        new_evaluation._id = evaluation_id.$oid;
        this.evaluations.push(new_evaluation);
        this.select(new_evaluation);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async remove() {
      this.showLoading("Eliminando");
      try {
        await deleteEvaluation(this.evaluation_selected._id);
        this.evaluations = this.evaluations.filter(
          (e) => e._id !== this.evaluation_selected._id
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeResult() {
      this.showLoading("Eliminando Resultado");
      let student_id = this.student_selected._id;
      try {
        await removeResult(this.evaluation._id, student_id);
        this.evaluation.results = this.evaluation.results.filter(
          (result) => result._id !== student_id
        );
        this.$refs.evaluation_results.init();
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async updateTime() {
      this.showLoading("Guardando Cambios");
      let evaluation_id = this.evaluation_selected._id;
      let evaluation_time_end = new Date(this.evaluation_selected.time_end_f);
      try {
        await this.$api.evaluation.update(evaluation_id, evaluation_time_end);
        this.evaluation_selected.time_end = evaluation_time_end;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showUpdateTime(evaluation) {
      this.dlg_update_time = true;
      this.evaluation_selected = evaluation;
      this.evaluation_selected.time_end_f = this.formatDate(
        this.evaluation_selected.time_end
      );
    },
    showRemoveResult(student) {
      this.dlg_remove_result = true;
      this.student_selected = student;
    },
    select(evaluation) {
      this.edit = true;
      this.evaluation = Object.assign({}, evaluation);
    },
    unselect() {
      this.evaluation = null;
      this.getEvaluations();
    },
    results(evaluation) {
      this.edit = false;
      this.evaluation = copy(evaluation);
    },
    formatDate(date) {
      let date_f = new Date();
      date_f.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      date_f = date_f.toISOString().substring(0, 16);
      return date_f;
    },
  },
  components: {
    EvaluationCard,
    EvaluationEditor,
    EvaluationResults,
  },
};
</script>

<style lang='scss' scoped>
.evaluations__menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>