<template>
  <v-card tile elevation="0" class="chat-container">
    <img class="chat-img" :src="src_avatar" />
    <v-speed-dial v-model="fab_emotions" absolute bottom right direction="left">
      <template v-slot:activator>
        <v-btn v-model="fab_emotions" color="blue darken-2" small dark fab>
          <v-icon v-if="fab_emotions">mdi-close</v-icon>
          <v-icon v-else>mdi-drama-masks</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" @click="showEmotion('HAP')">
        <v-icon>mdi-emoticon-happy-outline</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" @click="showEmotion('SAD')">
        <v-icon>mdi-emoticon-sad-outline</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" @click="showEmotion('ANG')">
        <v-icon>mdi-emoticon-angry-outline</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-card>
</template>

<script>
import { TextToSpeech } from "@/services/speech";

export default {
  data: () => ({
    src_avatar: "",
    time_emotion: 1000,
    time_maximum: 2147483647,
    //
    fab_emotions: false,
    timeout_animation: null
  }),
  mounted() {
    this.startAnimationNormal();
  },
  methods: {
    startAnimation(first_img, second_img, first_rate, second_rate) {
      this.src_avatar = require(`@/assets/avatar/${first_img}.png`);
      this.timeout_animation = setTimeout(() => {
        this.src_avatar = require(`@/assets/avatar/${second_img}.png`);
        this.startAnimation(second_img, first_img, second_rate, first_rate);
      }, first_rate);
    },
    stopAnimation() {
      clearTimeout(this.timeout_animation);
    },
    showEmotion(emotion) {
      this.stopAnimation();
      switch (emotion) {
        case "NOR":
          this.setImage("normal");
          break;
        case "HAP":
          this.setImage("happy");
          break;
        case "SAD":
          this.setImage("sad");
          break;
        case "ANG":
          this.setImage("angry");
          break;
        case "LOV":
          this.setImage("love");
          break;
      }
      this.timeout_animation = setTimeout(() => {
        this.startAnimationNormal();
      }, this.time_emotion);
    },
    startAnimationNormal() {
      this.stopAnimation();
      this.startAnimation("normal", "blink", 3000, 250);
    },
    startAnimationTalk(time = 2147483647) {
      this.stopAnimation();
      this.startAnimation("talk", "normal", 200, 200);
      setTimeout(() => {
        this.stopAnimation();
        this.setAnimationNormal();
      }, time);
    },
    setImage(img) {
      this.src_avatar = require(`@/assets/avatar/${img}.png`);
    },
    starTalk(text) {
      setTimeout(() => this.startAnimationTalk(), 100); // Fixed animation error
      TextToSpeech(text, () => this.startAnimationNormal());
    }
  }
};
</script>

<style lang='scss' scoped>
.chat-container {
  background: #f9ceff !important;

  .chat-img {
    display: block;
    margin: 0 auto;
    max-height: 190px;
  }
}
</style>