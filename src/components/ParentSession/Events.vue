<template>
  <div class="pb-3">
    <div class="m-legend">
      <div class="m-legend__item">
        <div class="m-legend__name">Eventos</div>
        <div class="m-legend__color" style="background-color: #178ae2"></div>
      </div>
      <div class="m-legend__item">
        <div class="m-legend__name">Tareas</div>
        <div class="m-legend__color" style="background-color: #00af3d"></div>
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
      let events = await this.$api.event.getAll(session_id);
      events.forEach((i) => {
        i.date = new Date(i.time_start.$date);
        i.color = "#178ae2";
        i.type = "event";
      });

      let tasks = await this.$api.task.getAll(session_id);
      tasks.forEach((i) => {
        i.date = new Date(i.time_start.$date);
        i.color = "#00af3d";
        i.type = "task";
      });

      this.events = events.concat(tasks);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
};
</script>