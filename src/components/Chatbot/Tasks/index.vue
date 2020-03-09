<template>
  <div class="list">
    <div v-show="!tasks_selected" class="calendar-container">
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
        @dateClick="dateClick"
        @eventClick="eventClick"
        eventTextColor="#fff"
      />
    </div>
    <!-- Task Selected -->
    <Task v-show="tasks_selected" :task_date="task_date" :tasks="tasks_selected" :unselectTasks="unselectTasks" />
  </div>
</template>

<script>
import { getTasks } from "@/services/taskService";
import { getParam } from "@/services/router.js";
import Task from "./Task";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  data: () => ({
    tasks: [],
    task_date: '',
    tasks_selected: null,
    //
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin],
    //
    calendar_date: null
  }),
  computed: {
    events() {
      return this.tasks.map(task => ({
        title: task.name,
        date: task.date
      }));
    }
  },
  async mounted() {
    this.chatbot_id = getParam("chatbot_id");
    this.calendar = this.$refs.calendar.getApi();

    this.updateCalendarDate();
    this.tasks = await getTasks(this.chatbot_id);
    this.loading_tasks = false;
  },
  methods: {
    dateClick({ dateStr }) {
      this.task_date = dateStr
      let tasks = this.tasks.filter(task => task.date === dateStr);
      if (tasks.length > 0) this.selectTasks(tasks);
    },
    eventClick() {},
    selectTasks(tasks) {
      this.tasks_selected = tasks;
    },
    unselectTasks() {
      this.tasks_selected = null;
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
    FullCalendar
  }
};
</script>

<style lang="scss">
@import "~@fullcalendar/core/main.css";
@import "~@fullcalendar/daygrid/main.css";

.list {
  padding-bottom: 34px;
}

.calendar-container {
  padding: 20px 20px 40px 20px;
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