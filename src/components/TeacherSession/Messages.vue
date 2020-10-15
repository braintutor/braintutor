<template>
  <div class="m-container">
    <h2>Mensajes Profesor</h2>

    <div class="m-card mt-4">
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

    <div class="m-card mt-4" v-if="student_selected">
      <div class="m-card__body">
        <div>
          <p v-for="(message, idx) in messages" :key="idx">{{ message }}</p>
        </div>
        <form @submit.prevent="addMessage()">
          <v-text-field
            v-model="new_message"
            :maxlength="MessageModel.message.max_length"
            :counter="MessageModel.message.max_length"
            required
          ></v-text-field>
          <m-btn color="primary" small>enviar</m-btn>
        </form>
      </div>
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
      this.showLoading("Enviando");
      try {
        this.$api.message.add(
          this.room_id,
          this.new_message,
          this.student_selected._id
        );
        this.messages.push({
          message: this.new_message,
        });
        this.new_message = "";
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
  },
};
</script>

<style>
</style>