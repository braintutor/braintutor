<template>
  <div class="container pt-0">
    <loading :active="loading" :message="loading_message" />
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
        :events="events"
        @dateClick="dateClick"
        @eventClick="eventClick"
        eventTextColor="#fff"
      />
      <div class="legend">
        <div class="legend__item" v-for="(session, s_idx) in sessions" :key="s_idx">
          <div class="legend__name">{{session.course.name}}</div>
          <div class="legend__color" :style="{'background-color': session.color}"></div>
        </div>
      </div>
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
import Event from "@/components/Session/Events/Event";
import loading from "@/components/loading";

import { getSessionsByStudent } from "@/services/sessionService";
import { getEventsByStudent } from "@/services/eventService";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  data: () => ({
    events: [],
    sessions: [],
    event_date: "",
    event_delete_id: "",
    dialog_delete: false,
    //
    show_events_selected: false,
    calendar_date: null,
    loading: true,
    loading_message: "",
    //
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin]
  }),
  computed: {
    events_selected() {
      return this.events.filter(event => event.date === this.event_date);
    }
  },
  async mounted() {
    this.loading_message = "Cargando Cursos";
    this.sessions = await getSessionsByStudent();
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
      this.loading = true;
      this.loading_message = "Cargando Eventos";
      let events = await getEventsByStudent();
      this.events = Object.entries(events).reduce(
        (arr, [session_id, event_arr]) => {
          if (event_arr) {
            // let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
            let color = "hsl(" + 360 * Math.random() + ", 50%, 50%)";
            let session = this.sessions.find(
              session => session._id.$oid == session_id
            );
            session.color = color;
            event_arr.map(event => {
              event.color = color;
            });
            arr = arr.concat(event_arr);
          }
          return arr;
        },
        []
      );
      this.loading = false;
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