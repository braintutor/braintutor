<template>
  <div v-if="cycle">
    <div class="d-flex justify-space-between">
      <h2>Horario del año {{ cycle.year }}</h2>
      <div v-if="selectedCycleSegment">
        <m-btn @click="showImportFile" color="dark" small class="mr-2">
          <v-icon left small>mdi-file-excel</v-icon>Importar
        </m-btn>
      </div>
    </div>
    <v-select
      class="mt-3"
      :items="cycle.segments"
      :label="'Seleccione un ' + displayType(cycle.segment_type)"
      :item-text="displaySegment"
      item-value="number"
      @change="chooseSegment"
    ></v-select>
    <div v-if="selectedCycleSegment" class="mt-4 box">
      <school-cycle-segment-card
        :segment="selectedCycleSegment"
        :type="cycle.segment_type"
      />
      <SessionFilter @query="filter"></SessionFilter>
    </div>
    <Calendario
      v-if="calendarStart != null && queryCalendar"
      :query="queryCalendar"
      :start="calendarStart"
    >
      <template v-slot:deleteSchedulePlan="{ item }">
        <v-btn
          @click="removeScheduleItem(item)"
          class="mx-1"
          color="error"
          small
          icon
        >
          <v-icon dark> mdi-delete </v-icon>
        </v-btn>
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
    <UploadFileSchedule
      v-if="selectedCycleSegment"
      :isVisible="isVisibleUpload"
      :cycle="cycle"
      :cycleNumber="selectedCycleSegment.number"
      @close="isVisibleUpload = false"
    ></UploadFileSchedule>
  </div>
</template>

<script>
import { getSchool } from "@/services/schoolService";
import {
  getSchoolCycle,
  formatSegment,
  displayType,
} from "@/services/schoolCycleService";
import { deleteProposed } from "@/services/scheduleService";
import SchoolModel from "@/models/School";
import Calendario from "@/components/Calendar";
import UploadFileSchedule from "@/components/Schedule/Upload";
import SessionFilter from "@/components/globals/Session/Filter";
import SchoolCycleSegmentCard from "./SchoolCycleSegmentCard";

const days = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
export default {
  components: {
    Calendario,
    SessionFilter,
    UploadFileSchedule,
    SchoolCycleSegmentCard,
  },
  data: () => ({
    school: {},
    SchoolModel,
    file: null,
    queryCalendar: null,
    dateItem: new Date(),
    start: null,
    end: null,
    menuStart: null,
    menuEnd: null,
    days: days,

    calendarStart: null,
    selectedDays: [],

    loadingCycle: false,
    cycle: null,
    selectedCycleSegment: null,
    isVisibleUpload: false,
  }),

  watch: {
    "$route.params": {
      handler: async function({ cycle_id }) {
        await this.getCycle(cycle_id);
      },
      immediate: true,
    },
  },
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
    displayType,
    displaySegment(segment) {
      return formatSegment(this.cycle.segment_type, segment.number);
    },
    async getCycle(cycleId) {
      this.showLoading("Cargando Datos");
      this.loadingCycle = true;
      try {
        this.cycle = await getSchoolCycle(cycleId);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
      this.loadingCycle = false;
    },

    chooseSegment(segmentCycleNumber) {
      this.selectedCycleSegment = this.cycle.segments.find(
        (s) => s["number"] == segmentCycleNumber
      );
      this.calendarStart = this.selectedCycleSegment["start"];
    },
    async onFileSelected(e) {
      this.file = e.target.files[0];
    },
    filter(query) {
      if (query.section_id) this.queryCalendar = query;
    },
    async removeScheduleItem(item) {
      this.$confirm(
        {
          callback: (confirm) => {
            if (confirm) {
               deleteProposed(item["schedule"]);
            }
          },
          message: `
           <p class="mt-4">
            Al eliminar este horario, se eliminaran todos las clases pertenecientes.
          </p>
          `,
        },
        "delete"
      );

     
    },
    updateScheduleDate(date, item) {
      /*eslint-disable */
      console.log(item, date);
      /*eslint-enable */
    },
    showImportFile() {
      this.isVisibleUpload = true;
    },
  },
};
</script>
