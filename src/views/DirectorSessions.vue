<template>
  <div class="m-container">
    <v-row no-gutters class="mb-3">
      <v-col class="col-4 px-2">
        <v-select
          v-model="level_selected"
          :items="levels"
          item-text="name"
          item-value="_id"
          label="Nivel"
        ></v-select>
      </v-col>
      <v-col class="col-4 px-2">
        <v-select
          v-model="grade_id"
          :items="grades_f"
          item-value="_id"
          item-text="name"
          label="Grado"
        ></v-select>
      </v-col>
      <v-col class="col-4 px-2">
        <v-select
          v-show="sections.length > 0"
          v-model="section_id"
          :items="sections"
          item-text="name"
          item-value="_id"
          label="Sección"
        ></v-select>
      </v-col>
    </v-row>
    <!-- Sessions -->
    <SessionCard
      v-for="session in sessions"
      :key="session._id"
      class="mb-3"
      :session="session"
      :buttons="[
        {
          text: 'Eventos',
          icon: 'mdi-calendar',
          color: 'primary',
          action: () => selectSession(session, 'events'),
        },
        {
          text: 'Tareas',
          icon: 'mdi-format-list-checks',
          color: 'success',
          action: () => selectSession(session, 'tasks'),
        },
        {
          text: 'Notas',
          icon: 'mdi-list-status',
          color: 'warning',
          action: () => selectSession(session, 'evaluations'),
        },
      ]"
    />
    <div v-show="section_id && sessions.length <= 0" class="text-center mt-3">
      No hay Sesiones
    </div>
  </div>
</template>

<script>
import SessionCard from "@/components/globals/Session/SessionCard";
import { getLevels } from "@/services/levelService";

export default {
  data: () => ({
    grades: [],
    grade_id: null,
    sections: [],
    section_id: null,
    sessions: [],
    levels: [],
    level_selected: "PRI",
  }),
  computed: {
    grades_f() {
      return this.grades.filter((g) => g.level === this.level_selected);
    },
  },
  watch: {
    level_selected() {
      this.grade_id = null;
    },
    async grade_id() {
      this.section_id = null;
      this.sections = [];

      if (this.grade_id) {
        this.showLoading("Cargando Aulas");
        try {
          this.sections = this.mongoArr(
            await this.$api.section.getAll({
              grade_id: this.grade_id,
            })
          );
          this.sections.sort((a, b) => a.name.localeCompare(b.name));
          this.section_id = this.sections[0] ? this.sections[0]._id : null;
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
    async section_id() {
      this.sessions = [];

      if (this.section_id) {
        this.showLoading("Cargando Sesiones");
        try {
          this.sessions = this.mongoArr(
            await this.$api.session.getAll({
              grade_id: this.grade_id,
              section_id: this.section_id,
            })
          );
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      }
    },
  },
  async created() {
    this.showLoading("Cargando Aulas");
    try {
      this.levels = await getLevels()

      this.grades = this.mongoArr(await this.$api.grade.getAll());
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    selectSession(session, category) {
      this.$router.push({
        name: `director-session-${category}`,
        params: { session_id: session._id },
      });
    },
  },
  components: {
    SessionCard,
  },
};
</script>

<style lang='scss' scoped>
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
  &__avatar {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 16px;
    background: var(--color-active);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }
}
</style>