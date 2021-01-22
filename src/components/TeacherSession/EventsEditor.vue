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
          <div v-if="event.videocall" class="mb-2">
            <a
              :href="event.videocall"
              target="_blank"
              class="m-btn m-btn--success m-btn--small"
              style="text-decoration: none; color: #fff"
            >
              <v-icon class="mr-1 mb-1" style="font-size: 1.2rem"
                >mdi-video</v-icon
              >Unirse a videollamada</a
            >
          </div>
          <div v-if="event.type === 'event'" class="m-card__actions pa-0 pt-4">
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
          <div v-if="event.type === 'task'" class="m-card__actions pa-0 pt-4">
            <m-btn
              @click="
                redirect('teacher-session-tasks', {
                  session_id: event.session_id,
                })
              "
              color="success"
              small
              text
              >Ir a Tareas</m-btn
            >
          </div>
          <div
            v-if="event.type === 'evaluation'"
            class="m-card__actions pa-0 pt-3"
          >
            <m-btn
              @click="
                redirect('teacher-session-evaluations', {
                  session_id: event.session_id,
                })
              "
              color="warning"
              small
              text
              >Ir a Evaluaciones</m-btn
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
          <div class="close-modal">
            <h2 v-if="action === 'create'">Nuevo Evento</h2>
            <h2 v-else>Editar Evento</h2>
            <v-btn class="mx-2" icon small @click="dlg_create= false">
              <v-icon dark> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <div class="mt-5">
            <strong class="mr-3">Fecha:</strong>
            <date-time v-model="date_selected"/>            
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
            <div v-if="new_event.videocall">
              <div>
                <a
                  :href="new_event.videocall"
                  target="_blank"
                  class="m-btn m-btn--success m-btn--small"
                  style="text-decoration: none; color: #fff"
                >
                  <v-icon class="mr-1 mb-1" style="font-size: 1.2rem"
                    >mdi-video</v-icon
                  >Unirse a videollamada</a
                >
                <v-btn icon small class="ml-2" @click="copyClipboard()">
                  <v-icon>mdi-content-copy</v-icon>
                </v-btn>
                <v-btn
                  icon
                  small
                  @click="
                    new_event.videocall = null;
                    $forceUpdate();
                  "
                  class="ml-2"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
              <span id="videocall" style="font-size: 0.75rem; color: #696969">{{
                new_event.videocall
              }}</span>
              <input
                id="ipt-videocall"
                type="text"
                :value="new_event.videocall"
                style="display: none"
              />
            </div>
            <m-btn
              v-else
              @click="addVideo"
              color="success"
              :rounded="false"
              small
              type="button"
              class="mr-2"
              :loading="ldg_videocall"
            >
              <v-icon class="mr-1 mb-1" style="font-size: 1.2rem"
                >mdi-video</v-icon
              >
              Añadir videollamada
            </m-btn>
          </div>
        </div>
        <div class="m-card__actions">
          <m-btn
            
            small
            type="button"
            @click="dlg_create = false"
            text
            class="cancel-button"
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
          <div class="close-modal">
            <h3>Confirmar eliminación</h3>
            <v-btn class="mx-2" icon small @click="dlg_delete = false">
              <v-icon>mdi-close-thick</v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn class="cancel-button" small @click="dlg_delete = false"
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
import { getParam, redirect } from "@/services/router.js";
import { 
  addEvent, updateEvent, 
removeEvent } from "@/services/eventService";

import EventModel from "@/models/Event";
import variables from "@/models/variables";
import DateTime from "@/components/globals/DateTime"

export default {
  components: {DateTime},
  data: () => ({
    session_id: "",
    events: [],
    event_selected: null,
    date_selected: new Date(),
    new_event: {},
    //
    action: "",
    ldg_videocall: false,
    dlg_create: false,
    dlg_delete: false,
    EventModel,
    variables,
  }),
  async created() {
    await this.init();
  },
  methods: {
    redirect,
    async init() {
      this.showLoading("Cargando Eventos");
      this.session_id = getParam("session_id");
      try {
        let all_events = [];
        let { events, tasks, evaluations } =
          this.mongoArr(
            await this.$api.event.getAll({ session_id: this.session_id })
          )[0] || {};

        all_events = all_events.concat(
          events.map((i) => ({
            date: i.time_start,
            type: "event",
            color: "var(--color-session-event)",
            ...i,
          }))
        );
        all_events = all_events.concat(
          tasks.map((i) => ({
            date: i.time_start,
            type: "task",
            color: "var(--color-session-task)",
            ...i,
          }))
        );
        all_events = all_events.concat(
          evaluations.map((i) => {
            return {
              date: i.time_start,
              type: "evaluation",
              title: i.name,
              description: `Termina el ${i.time_end.toLocaleDateString(
                "es-ES",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`,
              color: "var(--color-session-evaluation)",
              ...i,
            };
          })
        );

        this.events = all_events;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async saveEvent() {
      this.showLoading("Guardando Cambios");
      let new_event = this.new_event;
      new_event.time_start = this.date_selected;
      try {
        if (this.action === "create")
          await addEvent(this.session_id, new_event);
        else {
          new_event.id = new_event._id;
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
        await removeEvent(this.event_selected._id);
        this.events = this.events.filter(
          (event) => event._id != this.event_selected._id
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
      this.date_selected = new Date(event.date.getTime());// create a copy
      if (next) next();
    },
    showCreateByDate(date) {
      this.action = "create";
      this.dlg_create = true;
      this.new_event = {};
      this.date_selected = date
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

      this.date_selected =  new Date(year, month, day);
    },
    showRemove(event, next) {
      this.event_selected = event;
      this.dlg_delete = true;
      if (next) next();
    },
    addVideo() {
      if (this.ldg_videocall) return;

      this.ldg_videocall = true;
      setTimeout(() => {
        this.new_event.videocall = "https://meet.google.com/tjg-gpoi-pub";
        this.ldg_videocall = false;
        this.$forceUpdate();
      }, 1000);
    },
    copyClipboard() {
      var hidden = document.getElementById("ipt-videocall");
      hidden.style.display = "block";
      hidden.select();
      hidden.setSelectionRange(0, 99999);
      document.execCommand("copy");
      hidden.style.display = "none";
    },
  },
};
</script>
<style lang='scss' scoped>

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}

</style>