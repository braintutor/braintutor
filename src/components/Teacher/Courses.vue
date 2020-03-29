<template>
  <div>
    <loading :active="loading" />
    <div class="course m-card" v-for="(course, c_idx) in courses" :key="c_idx">
      <h3 class="course__name">{{course.name}}</h3>
      <div class="course__content">
        <div class="row no-gutters">
          <div
            class="col-6 col-sm-4 col-md-3 pa-2"
            v-for="(chatbot, ch_idx) in course.chatbots"
            :key="ch_idx"
          >
            <Cartel
              :title="chatbot.name"
              :callback="() => {}"
              :actions="[{
                  icon: 'mdi-eye',
                  callback: () => select(chatbot)
                },{
                  icon: 'mdi-square-edit-outline',
                  callback: () => edit(chatbot)
                }]"
            />
          </div>
          <div
            v-if="course.chatbots && course.chatbots.length < 4"
            class="col-6 col-sm-4 col-md-3 pa-2"
          >
            <div class="create transform-scale" @click="createChatbot(course)">+</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cartel from "@/components/Cartel";
import loading from "@/components/loading";

import { getCoursesByTeacher } from "@/services/courseService";
import { getChatbotsByCourse, addChatbot } from "@/services/chatbotService.js";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    courses: [],
    loading: true
  }),
  async mounted() {
    this.courses = await getCoursesByTeacher();
    for (let course of this.courses) {
      let chatbots = await getChatbotsByCourse(course._id.$oid);
      course.chatbots = chatbots;
    }
    this.loading = false;
  },
  methods: {
    select(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    },
    edit(chatbot) {
      redirect("chatbot-editor", { chatbot_id: chatbot._id.$oid });
    },
    async createChatbot(course) {
      this.loading = true;
      let chatbot = {
        name: "Nombre"
      };
      let chatbot_id = await addChatbot(course._id.$oid, chatbot);
      chatbot._id = chatbot_id;
      this.edit(chatbot);
      this.loading = false;
    }
  },
  components: {
    Cartel,
    loading
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.course {
  padding: 16px;
  margin-bottom: 20px;
  &__name {
    margin: 2px 8px 4px;
    font-size: 1.5rem;
  }
  &__content {
  }
}
.create {
  min-height: 160px;
  height: 100%;
  color: #b6b6b6;
  font-weight: lighter;
  font-size: 3rem;
  border: 2px dashed #b6b6b6;
  border-radius: 10px;
  //
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: #eee;
  }
}
</style>