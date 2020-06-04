<template>
  <div class="m-fullscreen">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselectEvents()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">{{format(event_date)}}</span>
      </div>
      <div class="menu-right"></div>
    </div>
    <div v-if="events.length > 0" id="events-scroll" class="m-fullscreen-content">
      <div
        class="event m-card"
        :style="{'border-left': `6px solid ${event.color}`}"
        v-for="(event, t_idx) in events"
        :key="t_idx"
      >
        <div class="event__menu">
          <span class="event__name">{{event.title}}</span>
        </div>
        <div class="event__content">
          <span class="event__description">{{event.description}}</span>
        </div>
        <div v-if="event.type === 'task'" class="event__actions">
          <v-btn text small @click="redirect('task', {task_id: event._id.$oid})">Ver Respuesta</v-btn>
        </div>
      </div>
    </div>
    <div class="no-info" v-else>No hay eventos.</div>
  </div>
</template>

<script>
import { redirect } from "@/services/router";
import { formatDate } from "@fullcalendar/core";

export default {
  props: ["event_date", "events", "unselectEvents", "restoreEvents"],
  methods: {
    redirect,
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