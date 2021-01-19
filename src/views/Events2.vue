<template>
  <v-row>
    <v-col>
      <v-sheet height="400">
        <v-calendar
          ref="calendar"
          :now="today"
          :value="today"
          :events="events"
          color="primary"
          type="week"
          @click:event="seeDetail"
        ></v-calendar>
        <!-- @click:time="addEvent" -->
      </v-sheet>
    </v-col>

    <!-- DLG SEE COURSE -->
    <v-dialog v-model="isEventSelected" max-width="450" persistent>
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Modificar Tiempo</h3>
            <v-btn class="mx-2" icon small @click="isEventSelected = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn @click="isEventSelected = false" class="cancel-button" small text
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              isEventSelected = false;
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
  </v-row>
</template>

<script>
import range from "lodash/range";
import { add, parse, format } from "date-fns/fp";

const thursday = 10;
const friday = 11;

const parseDate = parse(new Date())("yyyy-MM-dd HH:mm");
const formatDate = format("yyyy-MM-dd HH:mm");

const mondayTo = (endDay, event) =>
  range(7, endDay + 1)
    .map((x) => "2019-01-" + x)
    .map((date) => ({
      name: event.name,
      start: date + " " + event.startTime,
      end: date + " " + event.endTime,
      color: event.color,
    }));

export default {
  data: () => ({
    today: "2019-01-08",
    events: [
      // ejemplo 4to año
      // https://sites.google.com/site/colegionuevomundolaserena/alumnos/hora
      {
        name: "Lenguaje y comunicación",
        start: "2019-01-07 08:00",
        end: "2019-01-07 09:30",
        color: "blue",
      },
      ...mondayTo(friday, {
        name: "Recreo",
        startTime: "09:30",
        endTime: "09:50",
        color: "teal lighten-3",
      }),
      {
        name: "Matematicas",
        start: "2019-01-07 09:50",
        end: "2019-01-07 11:20",
        color: "red lighten-1",
      },
      ...mondayTo(friday, {
        name: "Recreo",
        startTime: "11:20",
        endTime: "11:40",
        color: "teal lighten-3",
      }),
      {
        name: "Educación Física",
        start: "2019-01-07 11:40",
        end: "2019-01-07 12:40",
        color: "lime",
      },
      ...mondayTo(thursday, {
        name: "Almuerzo",
        startTime: "12:40",
        endTime: "13:10",
        color: "cyan lighten-3",
      }),
      {
        name: "Educación Física",
        start: "2019-01-07 13:10",
        end: "2019-01-07 13:55",
        color: "lime",
      },
      {
        name: "Ingles",
        start: "2019-01-07 13:55",
        end: "2019-01-07 15:25",
        color: "teal darken-4",
      },

      // friday
      {
        name: "Lenguaje y comunicación",
        start: "2019-01-11 09:50",
        end: "2019-01-11 11:20",
        color: "blue",
      },
      {
        name: "Ciencias Naturales",
        start: "2019-01-11 11:40",
        end: "2019-01-11 12:40",
        color: "red accent-1",
      },
      {
        name: "Pequeños Lectores",
        start: "2019-01-11 12:40",
        end: "2019-01-11 13:10",
        color: "indigo darken-1",
      },
    ],
    isEventSelected: false,
  }),
  mounted() {
    this.$refs.calendar.scrollToTime("08:00");
  },
  methods: {
    addEvent(dateTime) {
      const start = this.getStart(dateTime);
      const end = add({ hours: 1 })(parseDate(start));

      const newEvent = {
        name: "Un curso",
        start,
        end: formatDate(end),
        color: "blue",
      };
      console.log(newEvent);
      this.events.push(newEvent);
    },
    getStart(dateTime) {
      // round to 0, 30
      const minute = dateTime.minute <= 30 ? 0 : 30;
      return dateTime.date + " " + dateTime.hour + ":" + minute;
    },
    seeDetail(event) {
      console.log(event);
      this.isEventSelected = true
    },
  },
};
</script>

<style>
</style>