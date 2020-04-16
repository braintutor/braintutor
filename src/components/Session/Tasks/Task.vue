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
    <div v-if="tasks.length > 0" id="tasks-scroll" class="m-fullscreen-content">
      <div
        class="task m-card"
        :style="{'border-left': `6px solid ${task.color}`}"
        v-for="(task, t_idx) in tasks"
        :key="t_idx"
      >
        <div class="task__menu">
          <span class="task__name">{{task.name}}</span>
        </div>
        <div class="task__content">
          <span class="task__description">{{task.description}}</span>
        </div>
      </div>
    </div>
    <div class="no-info" v-else>No hay Tareas</div>
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
</style>