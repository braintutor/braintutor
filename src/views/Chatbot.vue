<template>
  <div class="mcontainer">
    <Materials :course="course" :chatbot="chatbot" :materials="materials" />
  </div>
</template>

<script>
import Materials from "@/components/Chatbot/Materials";

import { getParam } from "@/services/router.js";
import {
  getChatbotAndMaterialsByStudent,
  getChatbotAndMaterialsByTeacher
} from "@/services/chatbotService";
import {
  getCourseByTeacher,
  getCourseByStudent
} from "@/services/courseService";

import { mapMutations } from "vuex";

export default {
  data: () => ({
    links: [
      {
        name: "Material",
        image: require("@/assets/braintutor/icon-material.png")
      },
      {
        name: "Conocimiento",
        image: require("@/assets/braintutor/icon-knowledge.png")
      },
      {
        name: "Configuración",
        image: require("@/assets/braintutor/icon-settings.png")
      }
    ],
    course: {},
    chatbot: {},
    materials: []
  }),
  async created() {
    this.loading(true);
    this.loading_msg("Cargando");

    let chatbot_id = getParam("chatbot_id");
    try {
      this.chatbot = (this.$store.state.user.role === "TEA"
        ? await getChatbotAndMaterialsByTeacher(chatbot_id)
        : await getChatbotAndMaterialsByStudent(chatbot_id))[0];
      this.materials = this.chatbot.materials;
      this.course = await (this.$store.state.user.role === "TEA"
        ? getCourseByTeacher(this.chatbot.course_id.$oid)
        : getCourseByStudent(this.chatbot.course_id.$oid));

      // Sorting Materials
      let order = (this.chatbot.order || []).reverse();
      this.materials.sort(
        (a, b) => order.indexOf(b._id.$oid) - order.indexOf(a._id.$oid)
      );
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }

    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"])
  },
  components: {
    Materials
  }
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
}
</style>