<template>
  <div class="container">
    <loading :active="loading" :message="loading_msg" />

    <!-- Course -->
    <section class="course">
      <p class="course__name">{{course.name}}</p>
      <div class="course__menu">
        <v-btn
          @click="show = 'MAT'"
          :outlined="show !== 'MAT'"
          class="mx-1"
          color="warning"
          small
          rounded
        >Material</v-btn>
        <v-btn
          @click="show = 'KNO'"
          :outlined="show !== 'KNO'"
          class="mx-1"
          color="primary"
          small
          rounded
        >Conocimiento</v-btn>
      </div>

      <section v-show="show === 'MAT'">
        <!-- Chatbot -->
        <section class="chatbot m-card" v-for="(chatbot, idx) in chatbots" :key="idx">
          <div class="chatbot__menu">
            <p class="chatbot__name">{{chatbot.name}}</p>
            <v-btn v-if="chatbot.show" @click="chatbot.show = false; $forceUpdate()" icon small>
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
            <v-btn v-else @click="chatbot.show = true; $forceUpdate()" icon small>
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </div>

          <!-- Material -->
          <div v-show="chatbot.show" class="materials">
            <!-- Material -->
            <div
              class="material m-card"
              v-for="(material, c_idx) in chatbot.materials"
              :key="c_idx"
            >
              <img class="material__image" :src="material.image" :alt="material.name" />
              <p class="material__name">{{material.name}}</p>
              <p class="material__description">{{material.overview}}</p>
            </div>
          </div>
        </section>
      </section>

      <!-- Knowledge -->
      <!-- <section v-show="show === 'KNO'">{{course.knowledge}}</section> -->
      <KnowledgeEditor
        v-show="show === 'KNO'"
        :get="getKnowledge"
        :update="updateKnowledge"
        :slot="1"
      />
    </section>
  </div>
</template>

<script>
import loading from "@/components/loading";
import KnowledgeEditor from "@/components/globals/KnowledgeEditor";

import { getParam } from "@/services/router.js";
import { getCourseByTeacher } from "@/services/courseService";
import { getChatbotsByCourse } from "@/services/chatbotService.js";
import { getMaterials } from "@/services/materialService";
import { updateCourseKnowledge } from "@/services/knowledgeService";

export default {
  data: () => ({
    course: {},
    chatbots: [],
    show: "MAT",
    //
    loading: false,
    loading_msg: ""
  }),
  async created() {
    this.loading = true;
    this.loading_msg = "Cargando Contenido";
    this.course_id = getParam("course_id");

    try {
      this.course = await getCourseByTeacher(this.course_id);
      this.chatbots = await getChatbotsByCourse(this.course_id);

      // Materials
      for (let chatbot of this.chatbots) {
        let materials = await getMaterials(chatbot._id.$oid);
        chatbot.materials = materials;
      }
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading = false;
  },
  methods: {
    async getKnowledge() {
      let { knowledge } = await getCourseByTeacher(this.course_id);
      return knowledge || [];
    },
    async updateKnowledge(knowledge) {
      return await updateCourseKnowledge(this.course_id, knowledge);
    }
  },
  components: {
    loading,
    KnowledgeEditor
  }
};
</script>

<style lang='scss' scoped>
.course {
  &__name {
    margin-bottom: 10px;
    text-align: center;
    font-size: 2.5rem;
    font-weight: bold;
  }

  &__menu {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}

.chatbot {
  margin-bottom: 12px;

  &__menu {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
  }

  &__name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: bold;
  }
}

.materials {
  padding: 18px;
  padding-top: 0;
  margin-top: -10px;
}

.material {
  margin-top: 10px;

  display: grid;
  grid-template-columns: minmax(60px, 10%) auto;
  grid-template-rows: auto 1fr;

  transition: 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.005);
  }

  &__image {
    width: 100%;
    padding: 10px;

    grid-row-start: 1;
    grid-row-end: 3;
  }

  &__name {
    padding: 10px;
    padding-bottom: 0;
    margin: 0;
    font-weight: bold;
    font-size: 1rem;
  }

  &__description {
    padding: 10px;
    margin: 0;
  }
}
</style>