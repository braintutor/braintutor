<template>
  <div class="m-fullscreen">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselectTasks()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">{{format(task_date)}}</span>
      </div>
      <div class="menu-right">
        <v-btn icon @click="createTask()">
          <v-icon>mdi-calendar-plus</v-icon>
        </v-btn>
        <v-btn icon @click="restoreTasks()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </div>
    </div>
    <div id="tasks-scroll" class="m-fullscreen-content">
      <div class="task m-card" v-for="(task, t_idx) in tasks" :key="t_idx">
        <div class="task__menu">
          <v-text-field
            class="task__name"
            v-model="task.name"
            autoGrow
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <v-btn icon @click="deleteTask(task._id.$oid)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon @click="saveTask(task)">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </div>
        <div class="task__content">
          <v-textarea
            class="task__description"
            v-model="task.description"
            :rows="1"
            autoGrow
            dense
            hide-details
            autocomplete="off"
          ></v-textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@fullcalendar/core";

export default {
  props: [
    "task_date",
    "tasks",
    "unselectTasks",
    "createTask",
    "saveTask",
    "deleteTask",
    "restoreTasks"
  ],
  methods: {
    format(date) {
      return formatDate(date, {
        day: "numeric",
        month: "long",
        year: "numeric",
        locale: "es"
      });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>