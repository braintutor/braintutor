<template>
  <div class="session m-card">
    <div class="m-card__body">
      <p class="session__course">{{ name }}</p>
      <div class="session__user">
        <v-icon class="session__avatar">{{
          user_icon || "mdi-account"
        }}</v-icon>
        <span class="mt-1">
          {{ user }}
        </span>
      </div>
    </div>
    <div class="session__actions m-card__actions">
      <m-btn
        v-for="(button, idx) in buttons"
        :key="idx"
        @click="button.action()"
        :color="button.color"
        text
        small
        class="ml-2"
      >
        <span class="session__btn-text">{{ button.text }}</span>
        <v-icon class="session__icon" style="font-size: 1.5rem">{{
          button.icon
        }}</v-icon>
      </m-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    user: String,
    user_icon: String,
    buttons: Array,
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
  &__user {
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
  &__actions {
    flex-wrap: wrap;
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