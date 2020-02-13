<template>
  <div class="calendar-container">
    <FullCalendar
      defaultView="dayGridMonth"
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
// import interactionPlugin from '@fullcalendar/interaction';

export default {
  data: () => ({
    locale: esLocale,
    calendarPlugins: [dayGridPlugin],
    events: [
      { title: "event 1", date: "2020-02-14" },
      { title: "event 2", date: "2020-02-15" }
    ]
  }),
  methods: {
    handleDateClick(arg) {
      console.log(arg.event);
      this.events.push({
        title: "event 1",
        date: "2020-02-20"
      });
    }
  },
  components: {
    FullCalendar
  }
};
</script>

<style lang="scss" scoped>
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";

.calendar-container {
  padding: 20px;
}
</style>