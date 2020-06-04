<template>
  <div class="m-fullscreen">
    <div class="menu">
      <div class="menu-left">
        <v-btn icon @click="unselectEvents()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">{{format(event_date)}}</span>
      </div>
      <div class="menu-right">
        <v-btn icon @click="createEvent()">
          <v-icon>mdi-calendar-plus</v-icon>
        </v-btn>
        <v-btn icon @click="restoreEvents()">
          <v-icon>mdi-restore</v-icon>
        </v-btn>
      </div>
    </div>
    <div id="events-scroll" class="m-fullscreen-content">
      <p class="empty" v-if="events.length <= 0">No hay eventos.</p>
      <div
        class="event m-card"
        :style="{'border-left': `6px solid ${event.color}`}"
        v-for="(event, t_idx) in events"
        :key="t_idx"
      >
        <div class="event__menu">
          <v-text-field
            class="event__name"
            :disabled="event.type === 'task'"
            v-model="event.title"
            autoGrow
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <v-btn v-if="event.type !== 'task'" icon @click="deleteEvent(event._id.$oid)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn v-if="event.type !== 'task'" icon @click="saveEvent(event)">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
        </div>
        <div class="event__content">
          <v-textarea
            class="event__description"
            :disabled="event.type === 'task'"
            v-model="event.description"
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
    "event_date",
    "events",
    "unselectEvents",
    "createEvent",
    "saveEvent",
    "deleteEvent",
    "restoreEvents"
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