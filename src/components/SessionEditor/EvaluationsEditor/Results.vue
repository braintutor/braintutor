<template>
  <div>
    <div class="menu">
      <div class="menu-left">
        <v-btn @click="unselect()" icon>
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <p class="menu-title">{{evaluation.name}}</p>
      </div>
    </div>

    <div v-if="evaluation" class="mt-3" style="overflow-x: auto">
      <table class="m-table">
        <thead>
          <tr>
            <th></th>
            <!-- <th></th> -->
            <th></th>
            <th class="text-center">C</th>
            <th class="text-center">I</th>
            <th class="text-center">B</th>
            <th></th>
            <th v-for="(c, idx) in evaluation.content" :key="idx" class="evaluation">{{idx + 1}}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(student, idx) in students"
            :key="idx"
            :set="values = getStats(student, evaluation)"
          >
            <td v-if="values.has_answer" class="text-center">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    small
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="dialog_dlt = true; student_dlt = student"
                    class="mb-1"
                  >
                    <v-icon>mdi-playlist-remove</v-icon>
                  </v-btn>
                </template>
                <span style="font-size: .75rem">Eliminar Nota</span>
              </v-tooltip>
            </td>
            <td v-else></td>
            <td class="student">{{`${student.last_name}, ${student.first_name}`}}</td>
            <!-- <td></td> -->
            <td class="text-center">{{values.corrects}}</td>
            <td class="text-center">{{values.incorrects}}</td>
            <td class="text-center">{{values.empty}}</td>
            <td></td>
            <td v-for="(item, idx) in values.answers_state" :key="idx">
              <div class="score" :class="`score--${item}`">
                <template v-if="item !== -1">
                  <v-icon v-if="item">mdi-check</v-icon>
                  <v-icon v-else>mdi-close</v-icon>
                </template>
                <template v-else>-</template>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Dialog Delete -->
    <v-dialog v-model="dialog_dlt" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">Si elimina la nota actual, el alumno podrá realizar el examen otra vez.</p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dialog_dlt = false" color="primary" small>Cancelar</m-btn>
          <m-btn
            @click="dialog_dlt = false; removeResult()"
            color="error"
            small
            class="ml-2"
          >Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { getParam } from "@/services/router.js";
import { getStudentsBySession } from "@/services/studentService";
import { getEvaluation, removeResult } from "@/services/evaluationService";
import { mapMutations } from "vuex";

export default {
  props: {
    evaluation_id: String,
    unselect: Function,
  },
  data: () => ({
    evaluation: {},
    students: [],
    //
    student_dlt: null,
    dialog_dlt: false,
  }),
  async created() {
    this.loading(true);
    this.loading_msg("Cargando Resultados");
    let session_id = getParam("session_id");
    try {
      this.evaluation = await getEvaluation(this.evaluation_id);
      this.students = await getStudentsBySession(session_id);
    } catch (error) {
      this.$root.$children[0].showMessage("", error.msg || error);
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    getStats(student, evaluation) {
      let corrects = 0;
      let incorrects = 0;
      let empty = evaluation.content.length;
      let answers_state = Array(evaluation.content.length).fill(-1);
      let has_answer = false;

      let student_answer = evaluation.results.find(
        (result) => result._id.$oid === student._id.$oid
      );

      if (student_answer) {
        has_answer = true;
        evaluation.content.forEach((c, idx) => {
          if (student_answer.answers[idx] !== -1)
            if (c.correct === student_answer.answers[idx]) {
              answers_state[idx] = 1;
              corrects++;
            } else {
              answers_state[idx] = 0;
              incorrects++;
            }
        });
        empty -= corrects + incorrects;
      }

      return { corrects, incorrects, empty, answers_state, has_answer };
    },
    async removeResult() {
      this.loading(true);
      this.loading_msg("Eliminando Resultado");
      let student_dlt_id = this.student_dlt._id.$oid;

      try {
        await removeResult(this.evaluation._id.$oid, student_dlt_id);
        this.evaluation.results = this.evaluation.results.filter(
          (result) => result._id.$oid !== student_dlt_id
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }

      this.loading(false);
    },
  },
};
</script>

<style lang='scss' scoped>
$cell-min-width: 36px;
$cell-max-width: 148px;

.m-table {
  margin: 0 auto;
  width: max-content;
  // padding: 10px;
  th {
    min-width: $cell-min-width;
    max-width: $cell-max-width;
    word-wrap: break-word;
    padding: 3px;
  }
  td {
    min-width: $cell-min-width;
    max-width: $cell-max-width;
    word-wrap: break-word;
    padding: 6px 2px;
  }
  .score {
    padding: 8px;
    color: rgb(128, 128, 128);
    text-align: center;
    font-size: 0.85rem;
    font-weight: bold;
    border-radius: 6px;

    &--0 {
      background: rgb(255, 103, 116);
      * {
        color: #fff;
      }
    }
    &--1 {
      background: rgb(67, 204, 73);
      * {
        color: #fff;
      }
    }
  }
}
</style>