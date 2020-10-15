<template>
  <div class="m-container">
    <div class="m-card">
      <div class="m-card__body">
        <m-btn
          v-for="(student, idx) in students"
          :key="idx"
          @click="student_selected = student"
          color="dark"
          small
          block
          text
          class="mb-2"
          >{{ `${student.last_name}, ${student.first_name}` }}</m-btn
        >
      </div>
    </div>

    <div class="chat m-card mt-4" v-if="student_selected">
      <div class="m-card__body">
        <div>
          <p
            v-for="(message, idx) in messages"
            :key="idx"
            class="message"
            :class="`message--${
              message.user_id !== student_selected._id ? '0' : '1'
            }`"
          >
            {{ message.message }}
          </p>
        </div>
      </div>
      <form @submit.prevent="addMessage()" class="input">
        <v-text-field
          v-model="new_message"
          :maxlength="MessageModel.message.max_length"
          required
          autocomplete="off"
          hide-details
          dense
        ></v-text-field>
        <v-btn :loading="loading_btn" icon class="ml-2"
          ><v-icon>mdi-send</v-icon></v-btn
        >
      </form>
    </div>
  </div>
</template>

<script>
import { getStudentsBySession } from "@/services/studentService";

import MessageModel from "@/models/Message";

export default {
  data: () => ({
    room_id: "",
    students: [],
    student_selected: null,
    messages: [],
    new_message: "",
    loading_btn: false,
    MessageModel,
  }),
  watch: {
    async student_selected() {
      await this.getMessages();
    },
  },
  async created() {
    this.room_id = this.$router.currentRoute.params["session_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("");
      try {
        this.students = this.mongoArr(await getStudentsBySession(this.room_id));
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async getMessages() {
      this.showLoading("");
      try {
        this.messages = [];
        this.messages = this.mongoArr(
          await this.$api.message.getAll(
            this.room_id,
            this.student_selected._id
          )
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
        await this.$api.message.add(
          this.room_id,
          new_message,
          this.student_selected._id
        );
        this.messages.push({
          message: new_message,
        });
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
}

.message {
  width: max-content;
  max-width: 75%;
  margin-bottom: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 10px #ccc;
  &--0 {
    margin-left: auto;
    background: var(--color-active);
    color: #fff;
  }
  &--1 {
  }
}

.input {
  padding: 8px 12px;
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);

  display: flex;
  align-items: center;
}
</style>