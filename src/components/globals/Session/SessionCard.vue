<template>
  <div class="session m-card">
    <div class="m-card__body">
      <div class="mb-3">
        <span class="session__level">{{ levels[session.grade.level] }}</span>
        <span class="session__grade">{{ session.grade.name }}</span>
        <span class="session__section">{{ session.section.name }}</span>
      </div>
      <h2 class="session__course mb-3">
        {{ session.course.name }}
      </h2>
      <div class="session__teacher mb-3">
        <v-icon class="session__avatar mr-2">mdi-account</v-icon>
        <span class="mt-1">
          {{ `${session.teacher.last_name}, ${session.teacher.first_name}` }}
        </span>
      </div>
    </div>
    <div class="m-card__actions">
      <m-btn
        v-for="(button, idx) in buttons"
        :key="idx"
        @click="button.action()"
        color="primary"
        small
        text
        class="ml-2"
      >
        <span class="session__btn-text">{{ button.text }}</span>
        <v-icon class="session__icon" style="font-size: 1.4rem">{{
          button.icon
        }}</v-icon>
      </m-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    session: Object,
    buttons: Array,
  },
  data: () => ({
    levels: {
      PRI: "Primaria",
      SEC: "Secundaria",
    },
  }),
};
</script>

<style lang='scss' scoped>
$color: #5299f7;

.session {
  &__level {
    padding-right: 8px;
    color: $color;
    font-size: 0.85rem;
    border-right: 1px solid $color;
  }
  &__grade {
    padding: 0 8px;
    color: $color;
    font-size: 0.85rem;
    border-right: 1px solid $color;
  }
  &__section {
    padding: 0 8px;
    color: $color;
    font-size: 0.85rem;
  }
  &__avatar {
    height: 1.5rem;
    width: 1.5rem;
    background: $color;
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }
  &__icon {
    display: none;
  }
}

@import "@/mvuecss/styles/_breakpoints.scss";

@include media-breakpoint(sm) {
  .session {
    &__btn-text {
      display: none;
    }
    &__icon {
      display: initial;
    }
  }
}
</style>