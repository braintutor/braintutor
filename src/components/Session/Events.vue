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

    <m-calendar :events="events" class="calendar">
      <template v-slot:event_info="{ event }">
        <div>
          <p class="mt-5">{{event.description}}</p>
        </div>
        <div v-if="event.type === 'task'" class="m-card__actions pa-0 pt-3">
          <m-btn
            @click="redirect('task', {task_id: event._id.$oid})"
            color="success"
            small
          >Ver Respuesta</m-btn>
        </div>
      </template>
    </m-calendar>
  </div>
</template>

<script>
import { getParam, redirect } from "@/services/router.js";
import { getEventsBySessionStudent } from "@/services/eventService";
import { getTasksBySessionStudent } from "@/services/taskService";

import { mapMutations } from "vuex";

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
    ...mapMutations(["loading", "loading_msg"]),
    async init() {
      this.loading(true);
      this.loading_msg("Cargando Eventos");
      this.session_id = getParam("session_id");
      try {
        let events = await getEventsBySessionStudent(this.session_id);
        events.forEach((i) => {
          i.date = new Date(i.time_start.$date);
          i.color = "#178ae2";
          i.type = "event";
        });

        let tasks = await getTasksBySessionStudent(this.session_id);
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