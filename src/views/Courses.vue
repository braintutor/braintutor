<template>
  <!-- Course List -->
  <v-container class="courses-container">
    <span class="courses-title">Mis Cursos</span>
    <div class="courses-search">
      <v-text-field v-model="chatbot_filter" dense hide-details>
        <v-icon slot="append-outer">mdi-magnify</v-icon>
      </v-text-field>
    </div>
    <loading :active="loading_courses" />
    <div class="course" v-for="(course, co_idx) in courses" :key="co_idx">
      <h1 class="course__title">{{course.name}}</h1>
      <v-container fluid class="pa-0">
        <v-row no-gutters>
          <v-col
            class="pa-3"
            cols="6"
            sm="4"
            md="3"
            lg="2"
            v-for="(chatbot, c_idx) in chatbots_filtered"
            :key="c_idx"
          >
            <Cartel
              :title="chatbot.course"
              :description="chatbot.name"
              :image="'https://dekids.com.mx/wp-content/uploads/2016/01/descarga.png'"
              :callback="() => {}"
              :actions="[{
                  icon: 'mdi-robot',
                  callback: () => selectChatbot(chatbot)
                },{
                  icon: 'mdi-square-edit-outline',
                  callback: () => editChatbot(chatbot)
                }]"
            />
          </v-col>
          <v-col class="create pa-3" cols="6" sm="4" md="3" lg="2">
            <div class="create__content" @click="createChatbot(course)">
              <v-icon>mdi-plus</v-icon>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-container>
</template>

<script>
import loading from "@/components/loading";
import Cartel from "@/components/Cartel";

import { redirect } from "@/services/router.js";
import { getCourses } from "@/services/courseService.js";
import { getChatbots, addChatbot } from "@/services/chatbotService.js";

export default {
  data: () => ({
    courses: [],
    chatbot_filter: "",
    loading_courses: true
  }),
  async mounted() {
    let courses = await getCourses();
    await Promise.all(
      courses.map(async course => {
        course.chatbots = await getChatbots(course._id.$oid);
        this.courses.push(course);
        this.chatbots = course.chatbots;
      })
    );
    this.loading_courses = false;
  },
  computed: {
    chatbots_filtered() {
      return this.chatbots.filter(
        chatbot =>
          chatbot.name
            .toLowerCase()
            .includes(this.chatbot_filter.toLowerCase()) ||
          chatbot.course
            .toLowerCase()
            .includes(this.chatbot_filter.toLowerCase())
      );
    },
    includes(text, filter) {
      return text.toLowerCase().includes(filter.toLowerCase());
    }
  },
  methods: {
    redirect,
    selectChatbot(chatbot) {
      redirect("chatbot", { chatbot_id: chatbot._id.$oid });
    },
    editChatbot(chatbot) {
      redirect("editor", { chatbot_id: chatbot._id.$oid });
    },
    async createChatbot(course) {
      this.loading_courses = true;
      let course_id = course._id.$oid;
      let chatbot = {
        name: "Nombre",
        students: []
      };

      let chatbot_id = await addChatbot(course_id, chatbot);
      chatbot._id = chatbot_id;
      this.editChatbot(chatbot);
      this.loading_courses = false;
    }
  },
  components: {
    loading,
    Cartel
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow.scss";

.courses-container {
  .courses-title {
    display: block;
    margin: 20px 0;
    color: #444444;
    text-align: center;
    font-size: 2.5em;
    font-weight: bold;
  }
  .courses-search {
    max-width: 600px;
    margin: 20px auto;
    padding: 10px 24px 10px 32px;
    border-radius: 50px;
    @include box-shadow;
  }
  .course {
    padding: 10px;
    border-radius: 10px;
    // @include box-shadow;
    &__title {
      padding: 8px 16px 4px 16px;
      font-size: 1.5rem;
    }
  }
}
.create {
  &__content {
    // height: 100%;
    min-height: 180px;
    border: 2px solid #c2c2c2;
    border-style: dashed;
    border-radius: 10px;
    transition: all 0.3s;
    //
    display: flex;
    justify-content: center;
    & * {
      color: #c2c2c2;
      font-size: 40px !important;
    }
    &:hover {
      cursor: pointer;
      background: #eeeeee;
    }
  }
}
</style>