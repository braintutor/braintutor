<template>
  <div class="chatbot" :class="{' chatbot--active': show}" @click="show = true">
    <v-icon
      v-if="show"
      @click="$event.stopPropagation(); show = false"
      class="chatbot__close"
    >mdi-close</v-icon>
    <div class="avatar">
      <img :src="require('@/assets/avatar/normal.png')" alt />
    </div>
    <div class="messages messages--active"></div>
    <div class="input">
      <input type="text" v-model="new_message" placeholder="Mensaje" />
      <!-- <v-btn icon small>
        <v-icon small>mdi-send</v-icon>
      </v-btn>-->
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: true,
    new_message: ""
  })
};
</script>

<style lang='scss' scoped>
.chatbot {
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
  z-index: 10000;
  cursor: pointer;

  position: fixed;
  right: 20px;
  bottom: 20px;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 10px rgba(0, 0, 0, 0.3);
  }

  &__close {
    position: absolute;
    top: 4px;
    right: 4px;

    &:focus {
      outline: none;
    }
  }

  &--active {
    border-radius: 0;
    cursor: initial;

    &:hover {
      transform: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
  }
}

.avatar {
  background: #7a7aff;
  transition: 0.3s;

  img {
    display: block;
    width: 100px;
    height: 100px;
    margin: 0 auto;
    transition: 0.3s;
  }

  .chatbot--active & {
    img {
      width: 140px;
      height: 140px;
    }
  }
}

.messages {
  width: 0;
  height: 0;
  max-height: calc(100vh - 200px);
  transition: 0.4s;

  .chatbot--active & {
    width: 350px;
    height: 350px;
    background: #fff;
  }
}

.input {
  padding: 6px;
  // border-top: 1px solid #ccc;
  background: #fff;
  display: flex;

  input[type="text"] {
    flex-grow: 1;

    padding: 5px 10px;
    background: #dbdbdb;
    font-size: .9rem;
    border-radius: 20px;

    &:focus {
      outline: none;
    }
  }
}
</style>