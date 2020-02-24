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
        <v-btn icon @click="saveTasks()">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </div>
    </div>
    <div id="tasks-scroll" class="pb-12 m-fullscreen-content">
      <div class="task-container" v-for="(task, t_idx) in tasks" :key="t_idx">
        <div class="task-menu">
          <v-text-field class="task-name" v-model="task.name" dense hide-details autocomplete="off"></v-text-field>
          <v-btn icon @click="deleteTask(task._id.$oid)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
        <div class="task-content">
          <div class="task-item">Detalle:</div>
          <v-textarea
            class="task-item-text"
            v-model="task.description"
            :rows="1"
            autoGrow
            dense
            hide-details
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
    "saveTasks",
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
@import "@/styles/box-shadow.scss";

.task-container {
  padding: 28px;
  padding-bottom: 10px;
  margin: 20px;
  margin-top: 5px;
  border-radius: 10px;
  @include box-shadow;

  .task-menu {
    display: flex;
    .task-name {
      margin-bottom: 25px !important;
      font-size: 1.5rem;
      font-weight: bold;
    }
  }
  .task-content {
    padding-bottom: 20px;
    .task-item {
      font-size: 1.2rem;
      padding-bottom: 8px;
      font-weight: bold;
    }
    .task-item-text {
      font-size: 1rem;
    }
  }
}
</style>