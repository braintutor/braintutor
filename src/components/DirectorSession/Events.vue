<template>
  <div class="pb-3">
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
        <div v-if="event.type === 'task'" class="m-card__actions pa-0 pt-4">
          <m-btn
            @click="$router.push({ name: 'director-session-tasks' })"
            color="success"
            small
            text
            class="mr-2"
            >Ir a Tareas</m-btn
          >
        </div>
        <div
          v-if="event.type === 'evaluation'"
          class="m-card__actions pa-0 pt-4"
        >
          <m-btn
            @click="$router.push({ name: 'director-session-evaluations' })"
            color="warning"
            small
            text
            >Ir a Evaluaciones</m-btn
          >
        </div>
      </template>
    </m-calendar>
  </div>
</template>

<script>
export default {
  data: () => ({
    events: [],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando Eventos");
    try {
      let all_events = [];
      let { events, tasks, evaluations } =
        this.mongoArr(await this.$api.event.getAll({ session_id }))[0] || {};

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
            description: `Termina el ${i.time_end.toLocaleDateString("es-ES", {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}`,
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
};
</script>