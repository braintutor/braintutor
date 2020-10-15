<template>
  <div class="m-container">
    <h2>Mensajes Alumno</h2>
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
</template>

<script>
import MessageModel from "@/models/Message";

export default {
  data: () => ({
    messages: [],
    new_message: "",
    MessageModel,
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      let room_id = this.$router.currentRoute.params["session_id"];
      this.showLoading("Cargando");
      try {
        this.messages = this.mongoArr(await this.$api.message.getAll(room_id));
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async addMessage() {
      let room_id = this.$router.currentRoute.params["session_id"];
      this.showLoading("Enviando");
      try {
        this.$api.message.add(room_id, this.new_message);
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