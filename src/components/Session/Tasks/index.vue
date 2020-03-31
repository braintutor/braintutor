<template>
  <div class="m-card">
    <loading :class="{active: loading_tasks}" />
    <div v-show="!show_tasks_selected" class="calendar-container pa-5">
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
    </div>
    <!-- Tasks Selected -->
    <Task
      v-show="show_tasks_selected"
      :task_date="task_date"
      :tasks="tasks_selected"
      :unselectTasks="unselectTasks"
      :restoreTasks="restoreTasks"
    />
  </div>
</template>

<script>
import Task from "./Task";
import loading from "@/components/loading";

import {
  getTasksBySessionStudent
} from "@/services/taskService";
import { getParam } from "@/services/router.js";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  data: () => ({
    session_id: "",
    task_date: "",
    tasks: [],
    task_delete_id: "",
    dialog_delete: false,
    //
    show_tasks_selected: false,
    calendar_date: null,
    loading_tasks: true,
    //
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin]
  }),
  computed: {
    events() {
      return this.tasks.map(task => ({
        title: task.name,
        date: task.date
      }));
    },
    tasks_selected() {
      return this.tasks.filter(task => task.date === this.task_date);
    }
  },
  async mounted() {
    this.session_id = getParam("session_id");
    this.calendar = this.$refs.calendar.getApi();
    this.updateCalendarDate();
    await this.restoreTasks();
  },
  methods: {
    dateClick({ dateStr }) {
      this.task_date = dateStr;
      this.show_tasks_selected = true;
    },
    eventClick() {},
    async unselectTasks() {
      this.show_tasks_selected = false;
      this.loading_tasks = true;
      this.tasks = await getTasksBySessionStudent(this.session_id);
      this.loading_tasks = false;
    },
    async restoreTasks() {
      this.loading_tasks = true;
      this.tasks = await getTasksBySessionStudent(this.session_id);
      this.loading_tasks = false;
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
    Task,
    FullCalendar,
    loading
  }
};
</script>

<style lang="scss">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";

.calendar-container {
  .calendar-control {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .calendar-date {
      font-weight: bold;
      font-size: 1.5rem;
    }
  }
  .fullcalendar {
    max-width: 850px;
    margin: 0 auto;
  }
}

.fc-widget-content {
  cursor: pointer;
}
.fc-event-container {
  font-size: 1rem;
  pointer-events: none;
}

.fc-toolbar {
  display: none;
}
.fc-scroller {
  overflow: hidden !important;
  height: auto !important;
}
</style>