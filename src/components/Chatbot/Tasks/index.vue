<template>
  <div class="calendar-container">
    <div class="calendar-control">
      <p>{{calendar_date}}</p>
      <v-btn @click="today()">today</v-btn>
      <v-btn @click="prev()">prev</v-btn>
      <v-btn @click="next()">next</v-btn>
    </div>
    <FullCalendar
      ref="calendar"
      :locale="locale"
      :plugins="calendarPlugins"
      :events="events"
      @eventClick="handleDateClick"
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
      { title: "event 1", date: "2020-02-14" },
      { title: "event 2", date: "2020-02-15" }
    ],
    //
    calendar_date: null
  }),
  mounted() {
    this.calendar = this.$refs.calendar.getApi();
    this.updateCalendarDate();
  },
  methods: {
    handleDateClick() {
      // console.log(arg.event);
      this.events.push({
        title: "event 1",
        date: "2020-02-20"
      });
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
      this.calendar_date = formatDate(this.getCalendarDate(), {
        month: "long",
        year: "numeric",
        locale: "es"
      });
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
  padding: 20px;
}
.fc-toolbar.fc-header-toolbar {
  display: none;
}
</style>