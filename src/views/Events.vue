<template>
  <div class="m-container py-3">
    <div class="filter">
      <span class="filter__text">Mostrar:</span>
      <label class="filter__item">
        <input
          class="mr-1"
          type="checkbox"
          value="event"
          v-model="filters"
        />Eventos
      </label>
      <label class="filter__item">
        <input
          class="mr-1"
          type="checkbox"
          value="task"
          v-model="filters"
        />Tareas
      </label>
      <label class="filter__item">
        <input
          class="mr-1"
          type="checkbox"
          value="evaluation"
          v-model="filters"
        />Evaluaciones
      </label>
    </div>

    <div class="m-legend">
      <div
        class="m-legend__item"
        v-for="(session, s_idx) in sessions"
        :key="s_idx"
      >
        <div class="m-legend__name">{{ session.course.name }}</div>
        <div
          class="m-legend__color"
          :style="{ 'background-color': session.color }"
        ></div>
      </div>
    </div>

    <m-calendar :events="events_f">
      <template v-slot:event_info="{ event }">
        <div v-if="event.type === 'task'" class="m-card__actions pa-0 pt-4">
          <m-btn
            @click="redirectTask(event)"
            color="primary"
            small
            :text="user.role === 'TEA'"
            >{{ user.role === "TEA" ? "Ir a Tareas" : "Ver Tarea" }}</m-btn
          >
        </div>
        <div
          v-if="event.type === 'evaluation'"
          class="m-card__actions pa-0 pt-4"
        >
          <m-btn @click="redirectEvaluation(event)" color="primary" small text
            >Ir a Evaluaciones</m-btn
          >
        </div>
      </template>
    </m-calendar>
  </div>
</template>

<script>
import { redirect } from "@/services/router.js";
import { mapState } from "vuex";

export default {
  data: () => ({
    sessions: [],
    events: [],
    filters: ["task", "event", "evaluation"],
  }),
  computed: {
    ...mapState(["user"]),
    events_f() {
      return this.events.filter((event) => this.filters.includes(event.type));
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Eventos");
      try {
        let sessions = this.mongoArr(await this.$api.event.getAll({}));
        let events = [];

        sessions.forEach((session) => {
          let color = "hsl(" + 360 * Math.random() + ", 50%, 50%)";
          // let color = "#" + (((1 << 24) * Math.random()) | 0).toString(16);
          session.color = color;

          events = events.concat(
            session.events.map((i) => {
              return {
                date: i.time_start,
                type: "event",
                color,
                ...i,
              };
            })
          );
          events = events.concat(
            session.tasks.map((i) => {
              return {
                date: i.time_start,
                type: "task",
                color,
                ...i,
              };
            })
          );
          events = events.concat(
            session.evaluations.map((i) => {
              i.title = i.name;
              i.description = `Termina el ${i.time_end.toLocaleDateString(
                "es-ES",
                {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}`;
              return {
                date: i.time_start,
                type: "evaluation",
                color,
                ...i,
              };
            })
          );
        });
        this.sessions = sessions;
        this.events = events;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    redirectTask(event) {
      if (this.user.role === "TEA")
        redirect("teacher-session-tasks", {
          session_id: event.session_id,
        });
      else redirect("student-task", { task_id: event._id });
    },
    redirectEvaluation(event) {
      redirect(
        this.user.role === "TEA"
          ? "teacher-session-evaluations"
          : "student-session-evaluations",
        {
          session_id: event.session_id,
        }
      );
    },
  },
};
</script>


<style lang='scss' scoped>
.filter {
  width: max-content;
  margin: 0 auto 12px;
  font-size: 1rem;
  &__text {
    margin-right: 0.5rem;
    font-size: 0.95rem;
    font-weight: bolder;
  }
  &__item {
    margin-left: 0.75rem;
    font-size: 0.9rem;
    cursor: pointer;
  }
}
</style>