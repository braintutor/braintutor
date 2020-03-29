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
    <TaskEditor
      v-show="show_tasks_selected"
      :task_date="task_date"
      :tasks="tasks_selected"
      :unselectTasks="unselectTasks"
      :createTask="createTask"
      :saveTasks="saveTasks"
      :deleteTask="deleteTask"
      :restoreTasks="restoreTasks"
    />
    <!-- Dialog -->
    <v-dialog v-model="dialog_delete" max-width="300">
      <v-card>
        <v-card-title>Confirmar eliminación</v-card-title>
        <v-card-text>Si elimina este contenido, no podrá revertir los cambios.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog_delete = false">Cancelar</v-btn>
          <v-btn small depressed color="error" @click="deleteTaskAction()">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  getTasksBySession,
  addTask,
  updateTasks,
  removeTask
} from "@/services/taskService";
import { getParam } from "@/services/router.js";
import { copy } from "@/services/object";
import { scrollDown } from "@/services/scroll";

import TaskEditor from "./TaskEditor";
import loading from "@/components/loading";

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
      this.tasks = await getTasksBySession(this.session_id);
      this.loading_tasks = false;
    },
    async createTask() {
      let new_task = {
        name: "Nombre",
        date: this.task_date,
        description: "Detalle"
      };
      this.loading_tasks = true;
      let task_id = await addTask(this.session_id, new_task);
      new_task._id = task_id;
      this.tasks.push(new_task);
      this.loading_tasks = false;
      setTimeout(() => {
        scrollDown("tasks-scroll");
      }, 100);
    },
    async saveTasks() {
      this.loading_tasks = true;
      let tasks = copy(this.tasks_selected);
      tasks.forEach(task => {
        task.id = task._id.$oid;
      });
      await updateTasks(this.session_id, tasks);
      this.loading_tasks = false;
    },
    deleteTask(task_id) {
      this.dialog_delete = true;
      this.task_delete_id = task_id;
    },
    async deleteTaskAction() {
      this.dialog_delete = false;
      this.loading_tasks = true;
      await removeTask(this.task_delete_id);
      this.tasks = this.tasks.filter(
        task => task._id.$oid != this.task_delete_id
      );
      this.loading_tasks = false;
    },
    async restoreTasks() {
      this.loading_tasks = true;
      this.tasks = await getTasksBySession(this.session_id);
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
    TaskEditor,
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