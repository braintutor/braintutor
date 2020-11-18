<template>
  <div style="height: 100%">
    <div v-show="!course_selected" class="m-container">
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

      <div class="reports__body pt-4">
        <div v-show="!report_selected" class="m-container pa-0">
          <div
            v-for="(report, idx) in reports"
            :key="idx"
            @click="report_selected = report"
            class="report m-card mb-3"
          >
            <div class="report__body m-card__body">
              <strong>Título de la Unidad:</strong>
              <span>{{ report.material.name }}</span>
              <strong>Fecha:</strong>
              <span>{{ report.time_start_f }} </span>
            </div>
          </div>

          <p v-show="reports.length <= 0" class="text-center my-3">
            No hay reportes
          </p>
        </div>

        <!-- REPORT -->
        <div v-if="report_selected" class="m-container pa-0">
          <div style="display: flex; justify-content: flex-end">
            <m-btn @click="report_selected = null" color="dark" small text>
              <v-icon style="font-size: 1.2rem" class="mr-2">mdi-close</v-icon>
              <span>Cerrar</span>
            </m-btn>
          </div>
          <ReportEditor :material_id="report_selected.material_id" readonly />
        </div>
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
    time_end: null,
  }),
  async created() {
    let date = new Date();
    this.time_end =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() + 1).toString().padStart(2, 0) +
      "-" +
      date.getDate().toString().padStart(2, 0);

    this.showLoading("Cargando Cursos");
    try {
      this.courses = this.mongoArr(await this.$api.course.getAll());
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async showReports(course) {
      this.course_selected = course;
      this.report_selected = null;
      this.reports = [];

      this.showLoading("Cargando Reportes");
      try {
        let data = { course_id: course._id };
        if (this.time_end)
          data["time_end"] = new Date(this.time_end + "T24:00").toISOString();

        this.reports = this.mongoArr(await this.$api.report.getAll(data));
        this.reports.forEach((r) => {
          r.time_start_f = r.time_start
            ? this.formatDateTime(r.time_start)
            : "No hay fecha";
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
  components: {
    ReportEditor,
  },
};
</script>

<style lang='scss' scoped>
.reports {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__menu {
    z-index: 1;
    padding: 6px;
    padding-top: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  max-width: 800px;
  margin: 0 auto;
  cursor: pointer;
  &__body {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }
}
</style>