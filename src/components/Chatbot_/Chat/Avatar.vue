<template>
  <v-card tile elevation="0" class="avatar-container">
    <div v-for="(emotion, e_idx) in emotions" :key="e_idx">
      <img
        v-show="emotion === emotion_selected"
        class="avatar-image"
        :src="require(`@/assets/avatar/${emotion}.png`)"
      />
    </div>
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
import { TextToSpeech, stopSpeech } from "@/services/speech";

export default {
  data: () => ({
    emotion_selected: "normal",
    emotions: [
      "angry",
      "blink",
      "happy",
      "love",
      "normal",
      "sad",
      "talk",
      "wink"
    ],
    time_emotion: 700,
    time_maximum: 2147483647,
    //
    fab_emotions: false,
    timeout_animation: null
  }),
  mounted() {
    this.startAnimationNormal();
  },
  methods: {
    startAnimation(
      first_img,
      second_img,
      first_rate,
      second_rate,
      first_rate_range,
      second_rate_range
    ) {
      this.setImage(first_img);
      this.timeout_animation = setTimeout(() => {
        this.setImage(second_img);
        this.startAnimation(
          second_img,
          first_img,
          second_rate,
          first_rate,
          second_rate_range,
          first_rate_range
        );
      }, first_rate + Math.random() * first_rate_range);
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
      this.startAnimation("normal", "blink", 500, 200, 5000, 0);
    },
    startAnimationTalk() {
      this.stopAnimation();
      this.startAnimation("talk", "normal", 200, 200, 0, 0);
    },
    setImage(img) {
      this.emotion_selected = img;
    },
    startTalk(text, animation = true) {
      if (animation) this.startAnimationTalk();
      TextToSpeech(text, () => this.startAnimationNormal());
    },
    stopTalk() {
      stopSpeech();
      this.startAnimationNormal();
    }
  }
};
</script>

<style lang='scss' scoped>
.avatar-container {
  background: #94bfea !important;

  .avatar-image {
    display: block;
    margin: 0 auto;
    height: 25vh;
  }
}
</style>