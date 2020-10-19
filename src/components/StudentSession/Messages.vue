<template>
  <div class="m-container">
    <!-- MESSAGES -->
    <div class="chat m-card">
      <div class="chat__messages">
        <p
          v-for="(message, idx) in messages"
          :key="idx"
          class="message"
          :class="`message--${message.user_id === user._id.$oid ? '0' : '1'}`"
        >
          {{ message.message }}
        </p>
        <p v-show="messages.length <= 0" class="text-center my-4">
          No hay mensajes.
        </p>
      </div>
      <form @submit.prevent="addMessage()" class="chat__input">
        <v-text-field
          v-model="new_message"
          :maxlength="MessageModel.message.max_length"
          required
          autocomplete="off"
          hide-details
          dense
        ></v-text-field>
        <v-btn :loading="loading_btn" type="submit" icon class="ml-2" small>
          <v-icon style="font-size: 1.2rem">mdi-send</v-icon>
        </v-btn>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import MessageModel from "@/models/Message";

export default {
  data: () => ({
    room_id: "",
    messages: [],
    new_message: "",
    loading_btn: false,
    MessageModel,
  }),
  computed: {
    ...mapState(["user"]),
  },
  async created() {
    this.room_id = this.$router.currentRoute.params["session_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando");
      try {
        this.messages = this.mongoArr(
          await this.$api.message.getAll(this.room_id)
        );
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async addMessage() {
      if (this.loading_btn) return;

      this.loading_btn = true;
      let new_message = this.new_message;
      this.new_message = "";
      try {
        await this.$api.message.add(this.room_id, new_message);
        this.messages.push({
          user_id: this.user._id.$oid,
          message: new_message,
        });
        this.new_message = "";
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading_btn = false;
    },
  },
};
</script>

<style lang='scss' scoped>
.chat {
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__messages {
    padding: 10px;
    flex-grow: 1;
  }

  &__input {
    padding: 8px 12px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);

    display: flex;
    align-items: center;
  }
}

.message {
  width: max-content;
  max-width: 75%;
  margin-bottom: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 8px;
  box-shadow: 0 3px 6px #ccc;
  &--0 {
    margin-left: auto;
    background: var(--color-active);
    color: #fff;
  }
  &--1 {
  }
}
</style>