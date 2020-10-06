<template>
  <div class="m-container">
    <div class="m-legend">
      <div class="m-legend__item">
        <div class="m-legend__name">Eventos</div>
        <div
          class="m-legend__color"
          style="background-color: var(--color-session-event)"
        ></div>
      </div>
      <div class="m-legend__item">
        <div class="m-legend__name">Tareas</div>
        <div
          class="m-legend__color"
          style="background-color: var(--color-session-task)"
        ></div>
      </div>
      <div class="m-legend__item">
        <div class="m-legend__name">Evaluaciones</div>
        <div
          class="m-legend__color"
          style="background-color: var(--color-session-evaluation)"
        ></div>
      </div>
    </div>

    <m-calendar
      :events="events"
      :show_options="(event) => event.type === 'event'"
      :options="[
        {
          text: 'Editar',
          action: showEdit,
        },
        {
          text: 'Eliminar',
          action: showRemove,
        },
      ]"
      :menu="[
        {
          text: 'Crear',
          action: () => showCreateByDate(new Date()),
        },
      ]"
      @on-date-click="showCreate"
      class="my-3"
    >
      <template v-slot:event_info="{ event, methods }">
        <div>
          <p class="mt-5">{{ event.description }}</p>
          <div v-if="event.type === 'event'" class="m-card__actions pa-0 pt-3">
            <m-btn
              color="primary"
              small
              @click="showEdit(event, methods.hideEvent)"
              class="mr-2"
              >Editar</m-btn
            >
            <m-btn
              color="error"
              small
              @click="showRemove(event, methods.hideEvent)"
              >Eliminar</m-btn
            >
          </div>
        </div>
      </template>
    </m-calendar>

    <!-- DLG CREATE -->
    <v-dialog
      v-model="dlg_create"
      max-width="800"
      :persistent="action !== 'create'"
    >
      <form
        @submit.prevent="
          dlg_create = false;
          saveEvent();
        "
        class="m-card"
      >
        <div class="m-card__body">
          <h2 v-if="action === 'create'">Nuevo Evento</h2>
          <h2 v-else>Editar Evento</h2>
          <div class="mt-5">
            <strong class="mr-3">Fecha:</strong>
            <input type="datetime-local" v-model="date_selected" required />
          </div>
          <div class="mt-4">
            <v-text-field
              v-model="new_event.title"
              :maxlength="EventModel.title.max_length"
              :counter="EventModel.title.max_length"
              label="Título"
              required
            ></v-text-field>
            <v-textarea
              v-model="new_event.description"
              :maxlength="EventModel.description.max_length"
              :counter="EventModel.description.max_length"
              label="Descripción"
              required
            ></v-textarea>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn
            color="primary"
            small
            type="button"
            @click="dlg_create = false"
            text
            class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn color="primary" small type="submit">Guardar</m-btn>
        </div>
      </form>
    </v-dialog>

    <!-- DLG DELETE -->
    <v-dialog v-model="dlg_delete" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn color="primary" small @click="dlg_delete = false" class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            color="error"
            small
            @click="
              dlg_delete = false;
              removeEvent();
            "
            >Eliminar</m-btn
          >
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
import { getEvaluationsBySession } from "@/services/evaluationService";

import EventModel from "@/models/Event";
import variables from "@/models/variables";

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
    variables,
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Eventos");
      this.session_id = getParam("session_id");
      try {
        let events = await getEventsBySession(this.session_id);
        events.forEach((i) => {
          i.date = new Date(i.time_start.$date);
          i.color = "var(--color-session-event)";
          i.type = "event";
        });

        let tasks = await getTasksBySessionTeacher(this.session_id);
        tasks.forEach((i) => {
          i.date = new Date(i.time_start.$date);
          i.color = "var(--color-session-task)";
          i.type = "task";
        });

        let evaluations = await getEvaluationsBySession(this.session_id);
        evaluations.forEach((i) => {
          i.title = i.name;
          i.date = new Date(i.time_start.$date);
          i.description = `Termina el ${new Date(
            i.time_end.$date
          ).toLocaleDateString("es-ES", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`;
          i.color = "var(--color-session-evaluation)";
          i.type = "evaluation";
        });

        this.events = events.concat(tasks, evaluations);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async saveEvent() {
      this.showLoading("Guardando Cambios");
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
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeEvent() {
      this.showLoading("Eliminando Evento");
      try {
        await removeEvent(this.event_selected._id.$oid);
        this.events = this.events.filter(
          (event) => event._id.$oid != this.event_selected._id.$oid
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    showEdit(event, next) {
      this.action = "edit";
      this.dlg_create = true;
      this.new_event = { ...event };

      let date = new Date(event.date.getTime()); // create a copy
      this.date_selected = this.toLocalISOString(date);
      if (next) next();
    },
    showCreateByDate(date) {
      this.action = "create";
      this.dlg_create = true;
      this.new_event = {};
      this.date_selected = this.toLocalISOString(date);
    },
    showCreate(year, month, day) {
      if (
        this.events.filter((e) => e.type === "event").length >=
        this.variables.max_events_per_session
      )
        return;

      this.action = "create";
      this.dlg_create = true;
      this.new_event = {};

      let date = new Date(year, month, day);
      this.date_selected = this.toLocalISOString(date);
    },
    showRemove(event, next) {
      this.event_selected = event;
      this.dlg_delete = true;
      if (next) next();
    },
    toLocalISOString(date) {
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000); // remove 5 hours
      return date.toISOString().substring(0, 16);
    },
  },
};
</script>