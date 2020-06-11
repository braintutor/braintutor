<template>
  <div class="container pt-0">
    <loading :active="loading" :message="loading_message" />
    <div class="filter">
      <span class="filter__text">Mostrar:</span>
      <label class="filter__item">
        <input class="mr-1" type="checkbox" value="event" v-model="filters" />Eventos
      </label>
      <label class="filter__item">
        <input class="mr-1" type="checkbox" value="task" v-model="filters" />Tareas
      </label>
    </div>
    <div v-show="!show_events_selected" class="calendar-container m-card">
      <div class="calendar-control">
        <span class="calendar-date">{{calendar_date}}</span>
        <div class="calendar-actions">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="calendar-action" @click="today()">
                <v-icon>mdi-calendar-today</v-icon>
              </v-btn>
            </template>
            <span style="font-size: .75rem">Hoy</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="calendar-action" @click="prev()">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </template>
            <span style="font-size: .75rem">Mes Anterior</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" class="calendar-action" @click="next()">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
            <span style="font-size: .75rem">Mes Siguiente</span>
          </v-tooltip>
        </div>
      </div>
      <FullCalendar
        class="fullcalendar"
        ref="calendar"
        :locale="locale"
        :plugins="calendarPlugins"
        :events="events_f"
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
    filters: ["task", "event"],
    event_date: "",
    event_delete_id: "",
    dialog_delete: false,
    //
    show_events_selected: false,
    calendar_date: null,
    loading: true,
    loading_message: "",
    // CALENDAR
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin]
  }),
  computed: {
    events_f() {
      return this.events.filter(event => this.filters.includes(event.type));
    },
    events_selected() {
      return this.events_f.filter(event => event.date === this.event_date);
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
              if (event.type === "event") {
                event.title = `${event.title}`;
              } else if (event.type === "task") {
                event.title = `${event.title}`;
                event.date = this.dateFormat(event.time_start);
              }
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
    dateFormat(date) {
      date = new Date(date);
      let day = this.format_two_digits(date.getDate());
      let month = this.format_two_digits(date.getMonth() + 1);
      let year = date.getFullYear();
      // let hours = this.format_two_digits(date.getHours());
      // let minutes = this.format_two_digits(date.getMinutes());
      date = `${year}-${month}-${day}`;
      return date;
    },
    format_two_digits(n) {
      return n < 10 ? "0" + n : n;
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
.filter {
  width: max-content;
  margin: 0 auto 12px;
  font-size: 1rem;
  &__text {
    margin-right: 0.5rem;
    font-size: 0.95rem;
    font-weight: bolder;
  }
  &__item {
    margin-left: 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
  }
}
</style>