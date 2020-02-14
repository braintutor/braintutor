<template>
  <div class="calendar-container">
    <div class="calendar-control">
      <span class="calendar-date">{{calendar_date}}</span>
      <div class="calendar-actions">
        <v-btn class="calendar-action" icon @click="today()">
          <v-icon>mdi-calendar-today</v-icon>
        </v-btn>
        <v-btn class="calendar-action" icon @click="prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn class="calendar-action" icon @click="next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
    </div>
    <FullCalendar
      ref="calendar"
      :locale="locale"
      :plugins="calendarPlugins"
      :events="events"
      @eventClick="eventClick"
      eventTextColor="#fff"
    />
  </div>
</template>

<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
// import interactionPlugin from '@fullcalendar/interaction';

export default {
  data: () => ({
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin],
    events: [
      {
        title: "Matemáticas",
        date: "2020-02-14",
        task: "a"
      },
      {
        title: "Biología",
        date: "2020-02-15",
        task: "b"
      }
    ],
    //
    calendar_date: null
  }),
  mounted() {
    this.calendar = this.$refs.calendar.getApi();
    this.updateCalendarDate();
  },
  methods: {
    eventClick({ event }) {
      console.log(event.title, event.start, event.extendedProps);

      // this.events.push({
      //   title: "event 1",
      //   date: "2020-02-20"
      // });
    },
    // Calendar
    today() {
      this.calendar.today();
      this.updateCalendarDate();
    },
    prev() {
      this.calendar.prev();
      this.updateCalendarDate();
    },
    next() {
      this.calendar.next();
      this.updateCalendarDate();
    },
    gotoDate(date) {
      this.calendar.gotoDate(date);
      this.updateCalendarDate();
    },
    getCalendarDate() {
      return this.calendar.getDate();
    },
    updateCalendarDate() {
      let date = formatDate(this.getCalendarDate(), {
        month: "long",
        year: "numeric",
        locale: "es"
      });
      this.calendar_date = date.charAt(0).toUpperCase() + date.slice(1);
    }
  },
  components: {
    FullCalendar
  }
};
</script>

<style lang="scss">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";

.calendar-container {
  padding: 20px 20px 40px 20px;
  .calendar-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .calendar-date {
      font-weight: bold;
      font-size: calc(12px + 0.8vw);
    }
  }
}

.fc-toolbar {
  display: none;
}
.fc-scroller {
  overflow: auto !important;
  height: auto !important;
}
</style>