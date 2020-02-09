<template>
  <div>
    <div class="background">
      <v-container>
        <!-- Principal -->
        <div class="principal-container row">
          <div class="principal-content col-md-6">
            <h1 class="principal-title">BrainTutor</h1>
            <div
              class="principal-description"
            >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus esse laboriosam minus eveniet rem ullam quis libero, cum aspernatur deleniti totam quam at repellat vero nam repellendus officiis beatae magni. Accusamus esse laboriosam minus eveniet rem ullam quis libero, cum aspernatur deleniti totam.</div>
            <v-btn class="principal-action" color="grey darken-3" @click="redirect('login')">Empezar</v-btn>
          </div>
          <div class="principal-image col-md-6">
            <img src="@/assets/avatar/normal.png" alt />
          </div>
        </div>
      </v-container>
    </div>
    <!-- Secondary -->
    <div class="container">
      <div class="secondary-container row">
        <div class="secondary-content col-md-5">
          <h1 class="secondary-title">BrainTutor</h1>
          <div
            class="secondary-description"
          >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus esse laboriosam minus eveniet rem ullam quis libero, cum aspernatur deleniti totam quam at repellat vero nam repellendus officiis beatae magni.</div>
        </div>
        <div class="secondary-image col-md-7">
          <img class="elevation-3" src="@/assets/ui/resources.png" alt />
        </div>
      </div>
      <div class="secondary-container row">
        <div class="secondary-content col-md-5">
          <h1 class="secondary-title">BrainTutor</h1>
          <div
            class="secondary-description"
          >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus esse laboriosam minus eveniet rem ullam quis libero, cum aspernatur deleniti totam quam at repellat vero nam repellendus officiis beatae magni.</div>
        </div>
        <div class="secondary-image col-md-7">
          <img class="elevation-3" src="@/assets/ui/resources.png" alt />
        </div>
      </div>
    </div>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer";

import { redirect } from "@/services/router.js";

export default {
  data: () => ({}),
  methods: {
    redirect
  },
  components: {
    Footer
  }
};
</script>

<style lang="scss" scoped>
.background {
  background-image: url(~@/assets/backgrounds/waves.png),
    linear-gradient(237deg, #46b3ff 0%, #0752fe 100%);
  background-size: 100% 650px;
  min-height: 600px;
}
@media only screen and (max-width: 960px) {
  .background {
    background-size: auto 650px;
  }
}
.principal-container {
  padding: 5vw 10px 20vw 10px;
  .principal-content {
    margin-bottom: 20px;
    color: #fff;
    .principal-title {
      font-size: calc(14px + 5vw);
    }
    .principal-description {
      margin-top: 16px;
      font-size: calc(14px + 0.5vw);
      font-weight: lighter;
    }
    .principal-action {
      margin-top: 30px;
      display: block;
      color: #fff;
    }
  }
  .principal-image {
    display: flex;
    // align-items: center;
    justify-content: center;
    img {
      // width: 100%;
      max-height: 300px;
      border-radius: 10px;
    }
  }
}
.secondary-container {
  padding: 0 10px 18vw 10px;
  &.secondary-principal {
    color: #fff;
  }
  .secondary-content {
    margin-bottom: 20px;
    .secondary-title {
      font-size: calc(14px + 2.5vw);
    }
    .secondary-description {
      margin-top: 16px;
      font-size: calc(14px + 0.5vw);
      font-weight: lighter;
    }
    .secondary-action {
      margin: 30px 0;
      display: block;
      color: #fff;
    }
  }
  .secondary-image {
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      border-radius: 10px;
    }
  }
}
</style>