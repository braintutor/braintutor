<template>
  <div>
    <h2>Horarios</h2>
    <div class="d-flex justify-space-between">
      <div>
        <SessionFilter @query="filter"></SessionFilter>
        <TeacherChooser @choose="filterByTeacher"></TeacherChooser>
      </div>
      <form @submit.prevent="save()">
        <div class="">
          <input
            @change="onFileSelected($event)"
            onclick="value = null"
            type="file"
          />
        </div>
        <div class="mt-2 d-flex justify-space-between">
          <a href="/files/plantilla_horario.csv" __target="blank"
            >Descargar plantilla</a
          >

          <m-btn color="primary" small>Subir horarios</m-btn>
        </div>
      </form>
    </div>

    <Calendario :query="queryCalendar">
      <template v-slot:deleteSchedulePlan="{ item }">
        <m-btn
          @click="removeScheduleItem(item)"
          color="error"
          small
          class="ml-2"
          >Eliminar</m-btn
        >
      </template>
      <template v-slot:editSchedulePlan="{ item }">
        <div class="mt-5">
          <strong class="mr-3">Cambiar horario:</strong>
          <v-menu
            ref="menu"
            v-model="menuStart"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="start"
                label="Hora inicio"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuStart"
              v-model="start"
              full-width
              :max="end"
              @click:minute="$refs.menu.save(time)"
            ></v-time-picker>
          </v-menu>
          <v-menu
            ref="menu"
            v-model="menuEnd"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="end"
                label="Hora final"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuEnd"
              v-model="end"
              full-width
              :min="start"
              @click:minute="$refs.menu.save(time)"
            ></v-time-picker>
          </v-menu>
          <div class="d-flex">
            <v-checkbox
            class="mx-1"
              v-for="(day, idx) in days"
              :key="idx"
              v-model="selectedDays"
              :label="day"
              :value="day"
            ></v-checkbox>
          </div>
        </div>
      </template>
    </Calendario>
  </div>
</template>

<script>
import { getSchool } from "@/services/schoolService";
import { loadSchedule } from "@/services/scheduleService";
import TeacherChooser from "@/components/globals/Teacher/Choose";
import SchoolModel from "@/models/School";
import Calendario from "@/components/Calendar";
import SessionFilter from "@/components/globals/Session/Filter";
const days = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
export default {
  components: { Calendario, SessionFilter, TeacherChooser },
  data: () => ({
    school: {},
    SchoolModel,
    file: null,
    queryCalendar: {},
    dateItem: new Date(),
    start: null,
    end: null,
    menuStart: null,
    menuEnd: null,
    days: days,
    selectedDays: []
  }),
  async mounted() {
    this.showLoading("Cargando Datos");
    try {
      this.school = await getSchool();
      this.school = this.mongo(this.school);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async save() {
      this.showLoading("Guardando");
      try {
        var formData = new FormData();
        formData.append("file", this.file);
        await loadSchedule(this.school._id, formData);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
    filter(query) {
      this.queryCalendar = { ...this.queryCalendar, ...query };
    },
    filterByTeacher({ _id }) {
      console.log(_id);
      this.queryCalendar = { ...this.queryCalendar, ...{ teacher_id: _id } };
    },
    removeScheduleItem(item) {
      console.log("del", item);
    },
    updateScheduleDate(date, item) {
      console.log(item, date);
    },
  },
};
</script>
