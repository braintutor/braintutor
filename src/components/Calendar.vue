<template>
  <div>
    <v-row>
      <v-col>
        <v-toolbar flat>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet height="800">
          <v-calendar
            v-bind:interval-format="intervalFormat"
            v-bind:weekdays="weekdays"
            v-model="focus"
            ref="calendar"
            color="primary"
            type="week"
            :events="events"
            @click:event="seeDetail"
            @change="fetchEvents"
          ></v-calendar>
          <!-- @click:time="addEvent" -->
        </v-sheet>
      </v-col>

      <!-- DLG SEE COURSE -->
      <v-dialog v-model="isEventSelected" max-width="450" persistent>
        <div class="m-card">
          <div class="m-card__body">
            <div class="close-modal">
              <h3>Lenguaje y comunicación</h3>
              <v-btn class="mx-2" icon small @click="isEventSelected = false">
                <v-icon> mdi-close-thick </v-icon>
              </v-btn>
            </div>
            <p class="date-modal">
              Jueves, 21 enero. 8:00 – 9:30am cada semana, el martes, jueves,
              viernes, 13 veces
            </p>
            <v-avatar color="indigo">
              <v-icon dark> mdi-account-circle </v-icon>
            </v-avatar>
          </div>
          <div class="m-card__actions">
            <!-- <m-btn
            @click="isEventSelected = false"
            class="cancel-button"
            small
            text
            >Cancelar</m-btn
          > -->
            <m-btn
              @click="
                isEventSelected = false;
                updateTime();
              "
              color="primary"
              small
              class="ml-2"
              >Entrar a clase</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import { getEvents, generateColor } from "@/services/eventService";

export default {
  data: () => ({
    events: [],
    isEventSelected: false,
    focus: "",
    weekdays: [ 1,2,3,4,5,6]
  }),
  async mounted() {
    this.$refs.calendar.scrollToTime("08:00");
  },
  
  methods: {
    async fetchEvents(e) {
      this.events = (
        await getEvents({ startDate: e.start.date, endDate: e.end.date })
      ).results;
      this.events.map( e => { console.log(generateColor(e["color"])); e["color"] = generateColor(e["color"]) ; return e})
    },
    intervalFormat(date) {
      return date.time
    },
    getStart(dateTime) {
      // round to 0, 30
      const minute = dateTime.minute <= 30 ? 0 : 30;
      return dateTime.date + " " + dateTime.hour + ":" + minute;
    },
    seeDetail() {
      this.isEventSelected = true;
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
  },
};
</script>

<style lang="scss">
.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-modal {
  padding: 10px 0px 0px 0px;
}
</style>