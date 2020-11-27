<template>
  <div style="height: 100%">
    <div v-show="!course_selected" class="m-container">
      <v-select
        v-model="level_selected"
        :items="levels"
        item-value="_id"
        item-text="name"
        label="Nivel"
        class="px-2 mb-2"
      ></v-select>

      <div
        v-for="(course, idx) in courses"
        :key="idx"
        class="course m-card mb-4"
      >
        <div class="course__body m-card__body">
          <strong>Curso:</strong>
          <span>{{ course.name }}</span>
          <strong v-if="course.teacher">Docente:</strong>
          <span v-if="course.teacher">{{
            `${course.teacher.last_name}, ${course.teacher.first_name}`
          }}</span>
        </div>
        <div class="m-card__actions">
          <m-btn @click="showReports(course)" color="primary" small text
            >Ver Reportes</m-btn
          >
        </div>
      </div>
    </div>

    <!-- REPORTS -->
    <div v-if="course_selected" class="reports">
      <div class="reports__menu">
        <div class="m-menu">
          <div class="m-menu__left">
            <v-btn
              icon
              @click="
                course_selected = null;
                report_selected = null;
              "
            >
              <v-icon style="font-size: 1.4rem">mdi-arrow-left</v-icon>
            </v-btn>
            <span class="m-menu__title">{{ course_selected.name }}</span>
          </div>
          <div class="m-menu__right">
            <form
              @submit.prevent="showReports(course_selected)"
              class="reports__filter"
            >
              <strong class="mr-3">Desde:</strong>
              <input
                v-model="time_start"
                type="date"
                required
                class="reports__date mr-4"
              />
              <strong class="mr-3">Hasta:</strong>
              <input
                v-model="time_end"
                type="date"
                required
                class="reports__date"
              />
              <v-btn
                type="submit"
                color="primary"
                class="mx-3"
                x-small
                fab
                dark
              >
                <v-icon dark>mdi-magnify</v-icon>
              </v-btn>
            </form>
          </div>
        </div>
      </div>

      <div class="reports__list">
        <div
          v-for="(report, idx) in reports"
          :key="idx"
          @click="selectReport(report)"
          class="report"
          :class="{
            'report--active':
              report_selected && report._id === report_selected._id,
          }"
        >
          <div class="report__body">
            <strong>Unidad:</strong>
            <span>{{ report.material.name }}</span>
            <strong>Fecha:</strong>
            <span>{{ report.time_start_f }} </span>
          </div>
        </div>

        <p v-show="reports.length <= 0" class="text-center ma-3">
          No hay reportes
        </p>
      </div>

      <div class="reports__body py-3">
        <ReportEditor
          v-if="report_selected"
          :material_id="report_selected.material_id"
          readonly
        />
        <p v-show="!report_selected" class="text-center ma-3">
          Seleccione un reporte
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ReportEditor from "@/components/globals/Report/ReportEditor";

export default {
  data: () => ({
    courses: [],
    course_selected: null,
    reports: [],
    report_selected: null,
    levels: [
      {
        _id: "PRI",
        name: "Primaria",
      },
      {
        _id: "SEC",
        name: "Secundaria",
      },
    ],
    level_selected: "PRI",
    time_start: null,
    time_end: null,
  }),
  watch: {
    async level_selected() {
      await this.init();
    },
  },
  async created() {
    let date = new Date();
    this.time_end =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, 0) +
      "-" +
      date.getDate().toString().padStart(2, 0);
    date.setDate(date.getDate() - 7);
    this.time_start =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, 0) +
      "-" +
      date.getDate().toString().padStart(2, 0);

    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Cursos");
      this.courses = [];
      try {
        this.courses = this.mongoArr(
          await this.$api.course.getAll({ level: this.level_selected })
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async showReports(course) {
      this.course_selected = course;
      this.report_selected = null;
      this.reports = [];

      this.showLoading("Cargando Reportes");
      try {
        let data = { course_id: course._id };

        if (this.time_start && this.time_end) {
          data["time_start"] = new Date(
            this.time_start + "T00:00"
          ).toISOString();
          data["time_end"] = new Date(this.time_end + "T24:00").toISOString();
        }

        let reports = this.mongoArr(await this.$api.report.getAll(data));
        reports.forEach((r) => {
          r.time_start_f = r.time_start
            ? this.formatDateTime(r.time_start)
            : "No hay fecha";
        });
        this.reports = this.orderObjectsByDate(reports, "time_start");
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    selectReport(report) {
      this.showLoading("Cargando Reporte");
      this.report_selected = null;
      setTimeout(() => {
        this.hideLoading();
        this.report_selected = report;
      }, 100);
    },
  },
  components: {
    ReportEditor,
  },
};
</script>

<style lang='scss' scoped>
$border: 1px solid rgba(100, 121, 143, 0.122);
$width-list: 360px;

.reports {
  height: 100%;

  display: grid;
  grid-template-columns: $width-list 1fr;
  grid-template-rows: auto 1fr;

  &__menu {
    grid-column-start: 1;
    grid-column-end: 3;
    z-index: 1;
    padding: 6px;
    padding-top: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  &__list {
    padding: 12px 0;
    overflow: auto;
    border-right: $border;
  }
  &__body {
    overflow: auto;
  }

  &__filter {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  &__date {
    border: 1px solid #ccc;
    border-radius: 6px;
  }
}

.course {
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }
}

.report {
  padding: 16px;
  border-bottom: $border;
  font-size: 0.9rem;
  transition: .3s;
  cursor: pointer;

  &:hover {
    background: var(--background-active);
  }

  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 16px;
    row-gap: 8px;
  }
  &:first-child {
    border-top: $border;
  }

  &--active {
    background: var(--background-active);
    color: var(--color-active);
  }
}
</style>