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
            :start ="start"
            :events="events"
            @click:event="seeDetail"
            @change="changeDate"
          ></v-calendar>
          <!-- @click:time="addEvent" -->
          <CalendarItemDetail
            :item="eventSelected"
            @close="eventSelected = null"
          >
            <template v-slot:deleteSchedulePlan="{ item }">
              <slot name="deleteSchedulePlan" v-bind:item="item"></slot>
            </template>
            <template v-slot:editSchedulePlan="{ item }">
              <slot name="editSchedulePlan" v-bind:item="item"></slot>
            </template>
            <template v-slot:reSchedule="{ item }">
              <slot name="reSchedule" v-bind:item="item"></slot>
            </template>
          </CalendarItemDetail>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { getEvents, generateColor } from "@/services/eventService";
import CalendarItemDetail from "./CalendarItemDetail";

export default {
  components: {
    CalendarItemDetail,
  },
  data: () => ({
    events: [],
    isEventSelected: false,
    eventSelected: null,
    focus: "",
    weekdays: [1, 2, 3, 4, 5, 6],
    range: {},
  }),
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
    start:{
      type: String    }
  },
  watch: {
    range() {
      this.filterEvents();
    },
    query() {
      this.filterEvents();
    },
  },
  async mounted() {
    this.$refs.calendar.scrollToTime("07:00");
  },

  methods: {
    async filterEvents() {
      this.events = [];
      const response = await getEvents({
        range: this.range,
        query: this.query,
      });
      this.events = response.results;
      this.events.map((e) => {
        e["color"] = generateColor(e["color"]);
        return e;
      });
    },
    async changeDate(e) {
      this.range = { startDate: e.start.date, endDate: e.end.date };
    },
    intervalFormat(date) {
      return date.time;
    },
    getStart(dateTime) {
      // round to 0, 30
      const minute = dateTime.minute <= 30 ? 0 : 30;
      return dateTime.date + " " + dateTime.hour + ":" + minute;
    },
    seeDetail({ event }) {
      this.isEventSelected = true;
      this.eventSelected = event;
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
