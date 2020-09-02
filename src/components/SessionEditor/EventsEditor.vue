<template>
  <div class="m-container my-3">
    <div class="legend">
      <div class="legend__item">
        <div class="legend__name">Eventos</div>
        <div class="legend__color" style="background-color: #178ae2"></div>
      </div>
      <div class="legend__item">
        <div class="legend__name">Tareas</div>
        <div class="legend__color" style="background-color: #00af3d"></div>
      </div>
    </div>

    <m-calendar :events="events" class="calendar" @on-date-click="showCreate">
      <template v-slot:event_info="{ event }">
        <div>
          <p class="mt-5">{{event.description}}</p>
          <div v-if="event.type === 'event'" class="m-card__actions pa-0 pt-3">
            <m-btn color="primary" small @click="showEdit(event)" class="mr-2">Editar</m-btn>
            <m-btn color="error" small @click="dlg_delete = true; event_selected = event">Eliminar</m-btn>
          </div>
        </div>
      </template>
    </m-calendar>

    <!-- DLG CREATE -->
    <v-dialog v-model="dlg_create" max-width="800">
      <div class="m-card">
        <div class="m-card__body">
          <h2 v-if="action === 'create'">Nuevo Evento</h2>
          <h2 v-else>Editar Evento</h2>
          <div class="mt-5">
            <strong class="mr-3">Fecha:</strong>
            <input type="datetime-local" v-model="date_selected" />
          </div>
          <div class="mt-4">
            <v-text-field
              v-model="new_event.title"
              :maxlength="EventModel.title.max_length"
              :counter="EventModel.title.max_length"
              label="Título"
            ></v-text-field>
            <v-textarea
              v-model="new_event.description"
              :maxlength="EventModel.description.max_length"
              :counter="EventModel.description.max_length"
              label="Descripción"
            ></v-textarea>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn color="primary" small @click="dlg_create = false" text class="mr-2">Cancelar</m-btn>
          <m-btn color="primary" small @click="dlg_create = false; saveEvent()">Guardar</m-btn>
        </div>
      </div>
    </v-dialog>

    <!-- DLG DELETE -->
    <v-dialog v-model="dlg_delete" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">Si elimina este contenido, no podrá revertir los cambios.</p>
        </div>
        <div class="m-card__actions">
          <m-btn color="primary" small @click="dlg_delete = false" class="mr-2">Cancelar</m-btn>
          <m-btn color="error" small @click="dlg_delete = false; removeEvent()">Eliminar</m-btn>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import { getParam } from "@/services/router.js";
import {
  getEventsBySession,
  addEvent,
  updateEvent,
  removeEvent,
} from "@/services/eventService";
import { getTasksBySessionTeacher } from "@/services/taskService";

import { mapMutations } from "vuex";

import EventModel from "@/models/Event";

export default {
  data: () => ({
    session_id: "",
    events: [],
    event_selected: null,
    date_selected: null,
    new_event: {},
    //
    action: "",
    dlg_create: false,
    dlg_delete: false,
    EventModel,
  }),
  async created() {
    await this.init();
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    async init() {
      this.loading(true);
      this.loading_msg("Cargando Eventos");
      this.session_id = getParam("session_id");
      try {
        let events = await getEventsBySession(this.session_id);
        events.forEach((i) => {
          i.date = new Date(i.time_start.$date);
          i.color = "#178ae2";
          i.type = "event";
        });

        let tasks = await getTasksBySessionTeacher(this.session_id);
        tasks.forEach((i) => {
          i.date = new Date(i.time_start.$date);
          i.color = "#00af3d";
          i.type = "task";
        });

        this.events = events.concat(tasks);
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    async saveEvent() {
      this.loading(true);
      this.loading_msg("Guardando Cambios");

      let new_event = this.new_event;
      new_event.time_start = new Date(this.date_selected);

      try {
        if (this.action === "create")
          await addEvent(this.session_id, new_event);
        else {
          new_event.id = new_event._id.$oid;
          await updateEvent(new_event);
        }

        await this.init();
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    async removeEvent() {
      this.loading(true);
      this.loading_msg("Eliminando Evento");
      try {
        await removeEvent(this.event_selected._id.$oid);
        this.events = this.events.filter(
          (event) => event._id.$oid != this.event_selected._id.$oid
        );
      } catch (error) {
        this.$root.$children[0].showMessage("", error.msg || error);
      }
      this.loading(false);
    },
    showEdit(event) {
      this.action = "edit";
      this.dlg_create = true;
      this.new_event = { ...event };

      let date = new Date(event.date.getTime()); // create a copy
      this.date_selected = this.toLocalISOString(date);
    },
    showCreate(year, month, day) {
      this.action = "create";
      this.dlg_create = true;
      this.new_event = {};

      let date = new Date(year, month, day);
      this.date_selected = this.toLocalISOString(date);
    },
    toLocalISOString(date) {
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000); // remove 5 hours
      return date.toISOString().substring(0, 16);
    },
  },
};
</script>

<style lang='scss' scoped>
.calendar {
  box-shadow: none !important;
}
.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  &__item {
    margin: 10px 14px;
    display: flex;
    align-items: center;
  }
  &__name {
    font-size: 0.8rem;
  }
  &__color {
    height: 10px;
    width: 40px;
    margin-left: 10px;
  }
}
</style>