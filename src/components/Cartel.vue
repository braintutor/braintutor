<template>
  <div class="cartel__container transform-scale elevation-3" @click="callback()">
    <div class="cartel__menu">
      <div class="cartel__background" />
      <div class="cartel__actions">
        <v-btn
          v-for="(action, a_idx) in actions"
          :key="a_idx"
          class="cartel__action"
          fab
          small
          @click="action.callback"
        >
          <v-icon>{{action.icon}}</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="cartel__content m-fullcenter">
      <div v-if="title" class="cartel__title">{{title}}</div>
      <div v-if="description" class="cartel__description">{{description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "description", "image", "callback", "actions"]
};
</script>

<style lang='scss' scoped>
.cartel__container {
  height: 100%;
  border-radius: 10px;
  background: #fff;
  //
  display: flex;
  flex-direction: column;

  &:hover {
    cursor: pointer;
    .cartel__menu {
      .cartel__background {
        opacity: 1;
      }
    }
  }
  .cartel__menu {
    position: relative;
    height: 120px;
    .cartel__background {
      width: 100%;
      height: 100%;
      background: rgb(18, 20, 139);
      background: linear-gradient(
        90deg,
        rgba(18, 20, 139, 1) 0%,
        rgba(83, 85, 182, 1) 100%
      );
      border-radius: 10px 10px 0 0;
      opacity: 0.8;
    }
    .cartel__actions {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      //
      display: flex;
      justify-content: center;
      align-items: center;
      .cartel__action {
        margin: 0 6px;
      }
    }
  }
  .cartel__content {
    padding: 8px 12px;
    text-align: center;
    .cartel__title {
      padding: 3px 0;
      font-size: 1rem;
      font-weight: bold;
    }
    .cartel__description {
      padding: 1px 0;
      font-size: 0.9rem;
      font-weight: normal;
    }
  }
}
</style>