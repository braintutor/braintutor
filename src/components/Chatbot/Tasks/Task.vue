<template>
  <div class="m-fullscreen">
    <div class="menu">
      <v-btn icon @click="unselectTasks()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <!-- <span class="menu-title">{{task.name}}</span> -->
    </div>
    <div class="m-fullscreen-content">
      <div class="task-container" v-for="(task, t_idx) in tasks" :key="t_idx">
        <div class="task-course">{{task.course}}</div>
        <div class="task-content">
          <div class="task-item">Fecha:</div>
          <div>{{format(task.date)}}</div>
          <div class="task-item">Detalle:</div>
          <div>{{task.detail}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@fullcalendar/core";

export default {
  props: ["tasks", "unselectTasks"],
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

.menu {
  padding: 10px;
  display: flex;
  align-items: center;
  .menu-title {
    margin: 0 12px;
    font-size: 1.5rem;
    font-weight: bold;
  }
}
.task-container {
  padding: 28px;
  padding-bottom: 10px;
  margin: 20px;
  margin-top: 5px;
  border-radius: 10px;
  @include box-shadow;

  .task-course {
    padding-bottom: 20px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .task-content {
    display: grid;
    padding-bottom: 20px;
    grid-template-columns: auto 1fr;
    grid-row-gap: 2vw;
    grid-column-gap: 4vw;
    font-size: 1rem;
    .task-item {
      font-weight: bold;
      text-decoration: underline
    }
  }
}
</style>