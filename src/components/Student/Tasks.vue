<template>
  <div class="mb-3">
    <loading :active="loading_tasks" :message='loading_message'/>
    <div v-show="!show_tasks_selected" class="calendar-container m-card">
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
import Task from "@/components/Session/Tasks/Task";
import loading from "@/components/loading";

import { getTasksByStudent } from "@/services/taskService";

import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { formatDate } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";

export default {
  data: () => ({
    task_date: "",
    tasks: [],
    task_delete_id: "",
    dialog_delete: false,
    //
    show_tasks_selected: false,
    calendar_date: null,
    loading_tasks: true,
    loading_message: '',
    //
    calendar: null,
    locale: esLocale,
    calendarPlugins: [dayGridPlugin, interactionPlugin]
  }),
  computed: {
    events() {
      return this.tasks.map(task => ({
        title: task.name,
        date: task.date,
        color: task.color
      }));
    },
    tasks_selected() {
      return this.tasks.filter(task => task.date === this.task_date);
    }
  },
  async mounted() {
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
    },
    async restoreTasks() {
      this.loading_tasks = true;
      this.loading_message = 'Cargando Tareas'
      let tasks = await getTasksByStudent();
      this.tasks = Object.values(tasks).reduce((arr, task_arr) => {
        if (task_arr) {
          // let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
          let color = "hsl(" + 360 * Math.random() + ", 50%, 50%)";
          task_arr.map(task => {
            task.color = color;
          });
          arr = arr.concat(task_arr);
        }
        return arr;
      }, []);
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
@import "@/styles/tasks";
</style>