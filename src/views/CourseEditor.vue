<template>
  <div>
    <div class="history">
      <span class="history__back" @click="redirect()">Cursos</span>
      <span class="history__divider">></span>
      <span v-if="course">{{course.name}}</span>
      <span v-else>...</span>
    </div>
    <AppSidebar :links="links">
      <ChatbotsEditor :slot="0" />
      <KnowledgeEditor :get="get" :update="update" :slot="1" />
    </AppSidebar>
  </div>
</template>

<script>
import AppSidebar from "@/components/AppSidebar";
import ChatbotsEditor from "@/components/CourseEditor/ChatbotsEditor";
import KnowledgeEditor from "@/components/globals/KnowledgeEditor";

import { redirect, getParam } from "@/services/router.js";
import {
  getKnowledgeByCourse,
  updateKnowledgeByCourse
} from "@/services/knowledgeService";
import { getCourseName } from "@/services/courseService";

export default {
  data: () => ({
    course: "",
    course_id: "",
    links: [
      {
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQG1Ae3Y51_HRJFfzSZGzhp2ngW0O348sh2qDTiA3jSTzvUNY7G&usqp=CAU",
        text: "Unidades"
      },
      {
        image: require("@/assets/braintutor/icon-knowledge.png"),
        text: "Conocimiento"
      }
    ]
  }),
  async mounted() {
    this.course_id = getParam("course_id");
    this.course = await getCourseName(this.course_id);
  },
  methods: {
    async get() {
      return await getKnowledgeByCourse(this.course_id);
    },
    async update(knowledge) {
      return await updateKnowledgeByCourse(this.course_id, knowledge);
    },
    redirect() {
      redirect("teacher");
    }
  },
  components: {
    AppSidebar,
    ChatbotsEditor,
    KnowledgeEditor
  }
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

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