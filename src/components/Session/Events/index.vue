<template>
  <div>
    <loading :active="loading_events" :message="loading_message" />
    <div v-show="!show_events_selected" class="calendar-container m-card">
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
        class="fullcalendar"
        ref="calendar"
        :locale="locale"
        :plugins="calendarPlugins"
        :events="events_fc"
        @dateClick="dateClick"
        @eventClick="eventClick"
        eventTextColor="#fff"
      />
    </div>
    <!-- Events Selected -->
    <Event
      v-show="show_events_selected"
      :event_date="event_date"
      :events="events_selected"
      :unselectEvents="unselectEvents"
      :restoreEvents="restoreEvents"
    />
  </div>
</template>

<script>
import Event from "./Event";
import loading from "@/components/loading";

import { getEventsBySessionStudent } from "@/services/eventService";
import { getParam } from "@/services/router.js";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  data: () => ({
    session_id: "",
    event_date: "",
    events: [],
    event_delete_id: "",
    dialog_delete: false,
    //
    show_events_selected: false,
    calendar_date: null,
    loading_events: true,
    loading_message: "",
    //
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin]
  }),
  computed: {
    events_fc() {
      return this.events.map(event => ({
        title: event.name,
        date: event.date
      }));
    },
    events_selected() {
      return this.events.filter(event => event.date === this.event_date);
    }
  },
  async mounted() {
    this.session_id = getParam("session_id");
    this.calendar = this.$refs.calendar.getApi();
    this.updateCalendarDate();
    await this.restoreEvents();
  },
  methods: {
    dateClick({ dateStr }) {
      this.event_date = dateStr;
      this.show_events_selected = true;
    },
    eventClick() {},
    async unselectEvents() {
      this.show_events_selected = false;
    },
    async restoreEvents() {
      this.loading_events = true;
      this.loading_message = "Cargando Eventos";
      this.events = await getEventsBySessionStudent(this.session_id);
      this.loading_events = false;
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
    Event,
    FullCalendar,
    loading
  }
};
</script>

<style lang="scss">
@import "@/styles/events";
</style>