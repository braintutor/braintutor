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
        <span class="mt-5">{{ event.description }}</span>
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
    this.showLoading("Cargando Evaluaciones");
    try {
      let events = this.mongoArr(await this.$api.event.getAll(session_id));
      events.forEach((i) => {
        i.date = i.time_start;
        i.color = "var(--color-session-event)";
        i.type = "event";
      });

      let tasks = this.mongoArr(await this.$api.task.getAll(session_id));
      tasks.forEach((i) => {
        i.date = i.time_start;
        i.color = "var(--color-session-task)";
        i.type = "task";
      });

      let evaluations = this.mongoArr(
        await this.$api.evaluation.getAll(session_id)
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
};
</script>