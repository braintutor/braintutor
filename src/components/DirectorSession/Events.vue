<template>
  <div class="pb-3">
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

<style lang='scss' scoped>
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
    border-radius: 4px;
  }
}
</style>