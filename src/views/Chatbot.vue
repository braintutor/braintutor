<template>
  <div class="chatbot-container">
    <loading :active="loading_chatbot" :message="loading_message" />
    <v-row id="chatbot-scroll" class="chatbot-scroll fill-height" no-gutters>
      <div class="chatbot-content col-12 col-md-8 m-fullscreen">
        <Materials
          class="m-fullscreen-content"
          ref="component_materials"
          v-show="service_selected === 0"
          :chatbot="chatbot"
        />
      </div>
      <Chat class="chat-container col-12 col-md-4" :selectService="idx => selectService(idx)" />
    </v-row>
  </div>
</template>

<script>
import Chat from "@/components/Chatbot/Chat/index";
import Materials from "@/components/Chatbot/Materials/index";
import loading from "@/components/loading";

import { getParam } from "@/services/router.js";

import { getChatbotNameOrder } from "@/services/chatbotService";
import { getMaterials } from "@/services/materialService";
import { getQuizzesByMaterial } from "@/services/quizService";

export default {
  data: () => ({
    chatbot: {},
    chatbot_id: "",
    show_services: true,
    service_selected: 0,
    order: [],
    //
    loading_chatbot: true,
    loading_message: ""
  }),
  async mounted() {
    // Components
    this.$store.commit("setComponentMaterials", this.$refs.component_materials);
    this.chatbot_id = getParam("chatbot_id");

    this.loading_message = "Cargando Material";

    this.chatbot = await getChatbotNameOrder(this.chatbot_id);
    let order = (this.chatbot.order || []).reverse();

    let materials = await getMaterials(this.chatbot_id);
    for (let material of materials) {
      material.quizzes = await getQuizzesByMaterial(material._id.$oid);
    }
    materials.sort((a, b) => {
      let a_order = order.indexOf(a._id.$oid);
      let b_order = order.indexOf(b._id.$oid);
      return b_order - a_order;
    });
    this.$store.commit("setMaterials", materials);

    this.loading_chatbot = false;
  },
  components: {
    Chat,
    Materials,
    loading
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow.scss";

.chatbot-container {
  height: calc(100vh - 65px);
  .chatbot-content {
    position: relative;
    border-right: 1px solid #eee;
  }
}
.services-action-bot {
  display: none;
  img {
    border-radius: 10px;
  }
}

@media only screen and (max-width: 955px) {
  .services-action-bot {
    display: block;
  }
  .chatbot-container {
    height: calc(100vh - 57px);
    margin: 0;
    .chatbot-scroll {
      flex-wrap: nowrap;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      &::-webkit-scrollbar {
        display: none;
      }
      .chat-container {
        scroll-snap-align: start;
      }
      .chatbot-content {
        scroll-snap-align: start;
      }
    }
  }
}
</style>
