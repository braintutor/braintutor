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
        evaluation.time_start | datetime
      }}</span>
      <span class="evaluation__date">{{
        evaluation.time_end | datetime
      }}</span>
      <div class="evaluation__options">
        <v-tooltip v-if="evaluation.is_public " bottom>
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
        <slot v-bind:evaluation="evaluation"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    evaluations: Array,
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