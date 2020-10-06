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

    <m-calendar :events="events">
      <template v-slot:event_info="{ event }">
        <div>
          <p class="mt-5">{{ event.description }}</p>
        </div>
        <div v-if="event.type === 'task'" class="m-card__actions pa-0 pt-3">
          <m-btn
            @click="redirect('task', { task_id: event._id.$oid })"
            color="success"
            small
            >Ver Respuesta</m-btn
          >
        </div>
      </template>
    </m-calendar>
  </div>
</template>

<script>
import { getParam, redirect } from "@/services/router.js";
import { getEventsBySessionStudent } from "@/services/eventService";
import { getTasksBySessionStudent } from "@/services/taskService";
import { getEvaluationsBySessionStudent } from "@/services/evaluationService";

export default {
  data: () => ({
    session_id: "",
    events: [],
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
        let events = this.mongoArr(
          await getEventsBySessionStudent(this.session_id)
        );
        events.forEach((i) => {
          i.date = i.time_start;
          i.color = "var(--color-session-event)";
          i.type = "event";
        });

        let tasks = this.mongoArr(
          await getTasksBySessionStudent(this.session_id)
        );
        tasks.forEach((i) => {
          i.date = i.time_start;
          i.color = "var(--color-session-task)";
          i.type = "task";
        });

        let evaluations = this.mongoArr(
          await getEvaluationsBySessionStudent(this.session_id)
        );
        evaluations.forEach((i) => {
          i.title = i.name;
          i.date = i.time_start;
          i.description = `Termina el ${i.time_end.toLocaleDateString("es-ES", {
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
  },
};
</script>