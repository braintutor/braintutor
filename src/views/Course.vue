<template>
  <div class="course container">
    <aside class="course__nav">
      <div class="course__nav-link transform-scale-plus" @click="idx = 0">
        <img src="@/assets/braintutor/icon-material.png" alt />
      </div>
      <div class="course__nav-link transform-scale-plus" @click="idx = 1">
        <img src="@/assets/braintutor/icon-task.png" alt />
      </div>
    </aside>
    <div class="course__content">
      <Chatbots v-show="idx === 0" />
      <Tasks v-show="idx === 1" />
    </div>
  </div>
</template>

<script>
import Chatbots from "@/components/Course/Chatbots";
import Tasks from "@/components/Course/Tasks/index";

export default {
  data: () => ({
    idx: 0
  }),
  async mounted() {},
  methods: {},
  components: {
    Chatbots,
    Tasks
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.course {
  $self: &;
  padding: 0 12px 12px 12px;
  border-radius: 10px;
  display: flex;

  &__nav {
    height: min-content;
    padding: 10px 8px;
    margin-right: 20px;
    border-radius: 10px;
    @include box-shadow;
    display: flex;
    flex-direction: column;

    #{$self}__nav-link {
      padding: 10px 4px;
      img {
        vertical-align: bottom;
        width: 36px;
        height: 36px;
      }
      &:hover {
        cursor: pointer;
      }
    }
  }

  &__content {
    flex-grow: 1;
    border-radius: 10px;
    @include box-shadow;

    #{$self}__block {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  &__title {
    font-size: 1.5rem;
  }
  &__subtitle {
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 16px;
  }
  &__input {
    font-size: 1.1rem;
  }
  &__actions {
    width: min-content;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .course {
    $self: &;
    flex-direction: column;

    &__nav {
      width: min-content;
      padding: 8px;
      margin: 0 auto 10px auto;
      flex-direction: row;

      #{$self}__nav-link {
        padding: 0 8px;
        img {
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
</style>