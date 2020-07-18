<template>
  <div class="mcontainer">
    <Materials ref="materials" :course="course" :chatbot="chatbot" :materials="materials" />
    <MChatbot :knowledge="knowledge" />
  </div>
</template>

<script>
import Materials from "@/components/Chatbot/Materials";
import MChatbot from "@/components/MChatbot/index";

import { getParam } from "@/services/router.js";
import {
  getChatbotAndMaterialsByStudent,
  getChatbotAndMaterialsByTeacher
} from "@/services/chatbotService";
import {
  getCourseByTeacher,
  getCourseByStudent
} from "@/services/courseService";
import { getQuestionTemplate } from "@/services/chatService";

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
    materials: [],
    knowledge: []
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

      //Knowledge Course
      let knowledge = this.course.knowledge || [];

      // Knowledge Material
      if (this.course.adaptive) {
        let question_template = await getQuestionTemplate();
        this.materials.forEach(material => {
          Object.entries(question_template).forEach(([category, questions]) => {
            if (questions[0]) {
              questions = questions.map(question =>
                question.replace(/@/, material.name)
              );
              knowledge.push({
                questions,
                answers: [
                  "Esto te puede servir.",
                  "He encontrado esta información."
                ],
                material_id: material._id.$oid,
                category
              });
            }
          });
          material.faq.forEach(({ question, answer }) => {
            knowledge.push({
              questions: [question],
              answers: [answer],
              material_id: material._id.$oid
            });
          });
        });
      } else {
        let questions = [
          "Muéstrame información sobre @.",
          '"Háblame sobre @.',
          "Explícame sobre @."
        ];
        this.materials.forEach(material => {
          knowledge.push({
            questions: questions.map(question =>
              question.replace(/@/, material.name)
            ),
            answers: [
              "Esto te puede servir.",
              "He encontrado esta información."
            ],
            material_id: material._id.$oid
          });
        });
      }

      //Knowledge Formating
      knowledge.forEach(k => {
        if (k.material_id) {
          k.actions = [
            {
              text: "Ver información",
              action: () => {
                this.$refs.materials.selectMaterialByID(k.material_id);
              }
            }
          ];
        }
      });
      this.knowledge = knowledge;
    } catch (error) {
      this.$root.$children[0].showMessage(
        "",
        error.msg || "Ha ocurrido un error."
      );
    }

    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"])
  },
  components: {
    Materials,
    MChatbot
  }
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
  margin-bottom: 100px;
}
</style>