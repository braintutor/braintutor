<template>
  <div class="m-container pb-3 px-1">
    <div>
      <v-select
        v-model="classroom_id"
        :items="classrooms"
        item-value="_id"
        item-text="name"
        label="Aula"
        class="px-2"
      ></v-select>
      <div v-show="!classroom_id" class="text-center mt-3">
        Seleccione un Aula
      </div>

      <!-- Sessions -->
      <div v-show="classroom_id">
        <div
          v-for="session in sessions"
          :key="session._id"
          class="session m-card mt-3"
        >
          <div class="m-card__body">
            <p class="session__course">{{ session.course.name }}</p>
            <div class="session__teacher">
              <v-icon class="mr-3">mdi-account-circle</v-icon>
              <span class="mt-1">
                {{
                  `${session.teacher.last_name}, ${session.teacher.first_name}`
                }}
              </span>
            </div>
          </div>
          <div class="m-card__actions">
            <m-btn color="primary" text small class="mr-2">Tareas</m-btn>
            <m-btn color="error" text small class="mr-2">Eventos</m-btn>
            <m-btn color="warning" text small>Evaluaciones</m-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    classrooms: [],
    sessions: [],
    classroom_id: null,
  }),
  watch: {
    async classroom_id() {
      this.$router
        .push({
          query: { classroom_id: this.classroom_id },
        })
        .catch(() => {});
      await this.getSessions(this.classroom_id);
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    let classroom_id = this.$route.query.classroom_id;
    try {
      this.classrooms = this.mongoArr(await this.$api.classroom.getAll());
      if (this.classrooms.map((c) => c._id).includes(classroom_id))
        this.classroom_id = classroom_id;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async getSessions(classroom_id) {
      if (!classroom_id) return;

      this.showLoading("Cargando Sesiones");
      try {
        this.sessions = this.mongoArr(
          await this.$api.session.getAll(classroom_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang='scss' scoped>
$background: rgba(80, 121, 255, 0.15);
$background-hover: rgba(80, 121, 255, 0.25);
$color: rgb(80, 121, 255);

.session {
  &__course {
    margin-bottom: 12px;
    color: #2b2e4a;
    font-size: 1.5rem;
    font-weight: bold;
  }
  &__teacher {
    color: #3f4158;
    display: flex;
    align-items: center;
  }
  &__btn {
    padding: 8px 16px;
    color: $color;
    border-radius: 8px;
    cursor: pointer;

    &:hover {
      background: $background-hover;
    }
  }
}
</style>