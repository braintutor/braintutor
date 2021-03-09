<template>
  <div>
    <div class="header">
      <span class="header__name">Nombre</span>
      <span class="header__name">Inicio</span>
      <span class="header__name">Fin</span>
    </div>
    <div
      v-for="(evaluation, idx) in evaluations"
      :key="idx"
      class="evaluation mb-2"
      :class="{ 'evaluation--disabled': !evaluation.is_public }"
    >
      <span class="evaluation__name">{{ evaluation.name }}</span>
      <span class="evaluation__date">{{
        toDateString(evaluation.time_start)
      }}</span>
      <span class="evaluation__date">{{
        toDateString(evaluation.time_end)
      }}</span>
      <div class="evaluation__options">
        <v-tooltip bottom v-if="hasShow">
          <template v-slot:activator="{ on }">
            <v-btn @click="$emit('edit', evaluation)" v-on="on" icon small>
              <v-icon style="font-size: 1.3rem">
                {{ evaluation.is_public ? "mdi-eye" : "mdi-pencil" }}
              </v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">{{
            evaluation.is_public ? "Ver" : "Editar"
          }}</span>
        </v-tooltip>
        <v-tooltip v-if="evaluation.is_public && hasResults" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="$emit('showResults', evaluation)"
              v-on="on"
              icon
              small
              class="ml-2"
            >
              <v-icon style="font-size: 1.3rem">mdi-poll</v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Resultados</span>
        </v-tooltip>
        <v-tooltip v-if="evaluation.is_public && hasTime" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="$emit('updateTime', evaluation)"
              v-on="on"
              icon
              small
              class="ml-2"
            >
              <v-icon style="font-size: 1.3rem">mdi-clock-time-four</v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Modificar Tiempo</span>
        </v-tooltip>
        <v-tooltip v-if="hasDelete" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="$emit('remove', evaluation)"
              v-on="on"
              icon
              small
              class="ml-2"
            >
              <v-icon style="font-size: 1.3rem"> mdi-delete </v-icon>
            </v-btn>
          </template>
          <span style="font-size: 0.75rem">Eliminar</span>
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evaluations: Array,
    hasShow:{
      type: Boolean,
      default: true
    },
    hasResults: {
      type: Boolean,
      default: true
    },
    hasTime: {
      type: Boolean,
      default: true
    },
    hasDelete: {
      type: Boolean,
      default:true
    }

  },
  methods: {
    toDateString(date) {
      let date_format = date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      return date_format;
    },
  },
};
</script>

<style lang="scss" scoped>


$grid-template-columns: 4fr 3fr 3fr 100px;


.header {
  padding: 12px 20px;
  font-size: 1rem;
  display: grid;
  grid-template-columns: $grid-template-columns;

  &__name {
    font-weight: bold;
  }
}


.evaluation {
  padding: 12px 20px;
  font-size: 0.9rem;
  background: #e8e8ff;
  border-radius: 12px;
  transition: 0.3s;
  display: grid;
  grid-template-columns: $grid-template-columns;
  align-items: center;

  &__name {
    font-weight: bold;
  }

  &__score {
    font-weight: bold;
  }

  &__options {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  &--disabled {
    background: #f7f7f7;
    .evaluation__name,
    .evaluation__date {
      color: #8a8a8a;
    }
  }
}

</style>