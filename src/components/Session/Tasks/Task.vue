<template>
  <div class="m-fullscreen">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselectTasks()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">{{format(task_date)}}</span>
      </div>
      <div class="menu-right"></div>
    </div>
    <div id="tasks-scroll" class="m-fullscreen-content">
      <div class="task-container" v-for="(task, t_idx) in tasks" :key="t_idx">
        <div class="task-menu">
          <span class="task-name">{{task.name}}</span>
        </div>
        <div class="task-content">
          <div class="task-item">Detalle:</div>
          <span class="task-item-text">{{task.description}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@fullcalendar/core";

export default {
  props: ["task_date", "tasks", "unselectTasks", "restoreTasks"],
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