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
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="dialog_new = true; new_event = {}">
              <v-icon>mdi-calendar-plus</v-icon>
            </v-btn>
          </template>
          <span style="font-size: .75rem">Agregar Evento</span>
        </v-tooltip>
      </div>
    </div>
    <div id="events-scroll" class="m-fullscreen-content">
      <p class="empty" v-if="events.length <= 0">No hay eventos.</p>
      <div v-for="(event, t_idx) in events" :key="t_idx">
        <!-- EVENT -->
        <section
          v-if="event.type === 'event'"
          class="event m-card"
          :style="{'border-left': `6px solid ${event.color}`}"
        >
          <div class="event__menu">
            <v-btn v-if="event.edit" @click="deleteEvent(event._id.$oid)" text small rounded>
              <v-icon class="mr-2" small>mdi-delete</v-icon>Eliminar
            </v-btn>
            <v-btn
              v-if="event.edit"
              @click="event.edit = false; saveEvent(event); $forceUpdate()"
              text
              small
              rounded
            >
              <v-icon class="mr-2" small>mdi-close</v-icon>Finalizar
            </v-btn>
            <v-btn v-else @click="event.edit = true; $forceUpdate()" text small rounded>
              <v-icon class="mr-2" small>mdi-pencil</v-icon>Editar
            </v-btn>
          </div>
          <v-text-field
            v-if="event.edit"
            class="event__title"
            v-model="event.title"
            placeholder="Título"
            autoGrow
            dense
            hide-details
            autocomplete="off"
          ></v-text-field>
          <p v-else class="event__title">{{event.title}}</p>
          <v-textarea
            v-if="event.edit"
            class="event__description mt-3"
            v-model="event.description"
            placeholder="Descripción"
            :rows="1"
            autoGrow
            dense
            hide-details
            autocomplete="off"
          ></v-textarea>
          <p v-else class="event__description">{{event.description}}</p>
        </section>
        <!-- TASK -->
        <section
          v-if="event.type === 'task'"
          class="event m-card"
          :style="{'border-left': `6px solid ${event.color}`}"
        >
          <p class="event__title">{{event.title}}</p>
          <p class="event__description">{{event.description}}</p>
        </section>
      </div>
    </div>

    <!-- CREATE -->
    <v-dialog v-model="dialog_new" persistent max-width="750">
      <v-card class="pt-4 pa-2">
        <v-card-text>
          <v-text-field v-model="new_event.title" label="Título"></v-text-field>
          <v-textarea v-model="new_event.description" label="Descripición" value></v-textarea>
        </v-card-text>
        <v-card-actions style="width: min-content; margin: 0 auto">
          <v-btn small text class="mr-1" @click="dialog_new = false">Cerrar</v-btn>
          <v-btn small color="primary" @click="dialog_new = false; createEvent(new_event)">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  data: () => ({
    new_event: {},
    dialog_new: false
  }),
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