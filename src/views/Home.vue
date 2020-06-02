<template>
  <div>
    <div class="background">
      <v-container>
        <!-- Principal -->
        <div class="principal-container row">
          <div class="principal-content col-sm-6">
            <h1 class="principal-title mt-1 mb-2">BrainTutor</h1>
            <div
              class="principal-description"
            >Braintutor es una plataforma para crear clases virtuales y chatbots educativos.</div>
            <div
              class="principal-description"
            >Monitorear el aprendizaje de los alumnos y brindarles una enseñanza personalizada.</div>
            <v-btn
              class="principal-action"
              color="grey darken-3"
              @click="redirect('login', {school_user: 'maria-prado-de-bellido'})"
            >Empezar</v-btn>
          </div>
          <div class="principal-image col-sm-6">
            <img src="@/assets/avatar/normal.png" alt />
          </div>
        </div>
      </v-container>
    </div>
    <!-- Services -->
    <v-container>
      <div class="services-container">
        <span class="services-title">Servicios</span>
        <div class="row">
          <div v-for="(service, s_idx) in services" :key="s_idx" class="col-sm-6 col-md-4">
            <div class="service-container transform-scale">
              <div class="service-image">
                <img :src="service.image" alt />
              </div>
              <div class="service-content">
                <div class="service-title">{{service.title}}</div>
                <div class="service-descripcion">{{service.description}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-container>
    <!-- Secondary -->
    <v-container>
      <div class="secondary-container row" v-for="(post, p_idx) in posts" :key="p_idx">
        <div class="secondary-content col-sm-4">
          <h1 class="secondary-title">{{post.title}}</h1>
          <div class="secondary-description">{{post.description}}</div>
        </div>
        <div class="secondary-image col-sm-8">
          <img class="transform-scale elevation-3" :src="post.image" alt />
        </div>
      </div>
    </v-container>
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer";

import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    services: [
      {
        title: "Clases",
        description: "Creación de clases virtuales",
        image: require("@/assets/braintutor/icon-material.png")
      },
      {
        title: "Evaluaciones",
        description: "Creación de evaluaciones constantes",
        image: require("@/assets/braintutor/icon-quiz.png")
      },
      {
        title: "Eventos",
        description: "Creación de eventos",
        image: require("@/assets/braintutor/icon-event.png")
      },
      {
        title: "Chatbot",
        description: "Chatbot como agente de apoyo",
        image: "https://www.synaptive.com/img/chatbot.png"
      },
      {
        title: "Monitoreo",
        description: "Monitorear el rendimiento",
        image:
          "https://www.searchpng.com/wp-content/uploads/2018/12/ic-search.png"
      },
      {
        title: "Acceso",
        description: "Accesible desde cualquier dispositivo",
        image:
          "https://images.vexels.com/media/users/3/136857/isolated/preview/a9e86748f463c75ad1a6a58e06abf25d-icono-plana-smartphone-by-vexels.png"
      }
    ],
    posts: [
      // {
      //   title: "Material",
      //   description:
      //     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Accusamus esse laboriosam minus eveniet rem ullam quis libero, cum aspernatur deleniti totam quam at repellat vero nam repellendus officiis beatae magni.",
      //   image: require("@/assets/ui/material.png")
      // },
      {
        title: "Clases Virtuales",
        description:
          "Con BrainTutor podrás crear tus clases de manera rápida y sencilla.",
        image: require("@/assets/ui/material-editor.png")
      },
      {
        title: "Evaluaciones",
        description:
          "Con BrainTutor podrás crear evaluaciones, para poner a prueba a tus estudiantes.",
        image: require("@/assets/ui/quiz.jpg")
      },
      {
        title: "Docente Virtual",
        description:
          "Tendrás tu propio bot virtual, el cual responderá las dudas de los estudiantes en base al contenido ingresado por el docente.",
        image: require("@/assets/ui/chat.jpg")
      },
      {
        title: "Tareas",
        description:
          "Puedes crear y revisar tareas, las cuales serán notificadas a los estudiantes.",
        image: require("@/assets/ui/task.png")
      }
    ]
  }),
  methods: {
    redirect
  },
  components: {
    Footer
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/box-shadow.scss";

.background {
  background-image: url(~@/assets/backgrounds/waves.png),
    linear-gradient(237deg, #46b3ff 0%, #0752fe 100%);
  background-size: 100% 640px;
  min-height: 640px;
}
@media only screen and (max-width: 960px) {
  .background {
    background-size: auto 640px;
  }
}
.principal-container {
  padding: calc(20px + 2.4vw) 10px 20vw 10px;
  .principal-content {
    margin-bottom: 20px;
    color: #fff;
    .principal-title {
      font-size: 4.5rem;
    }
    .principal-description {
      margin-top: 16px;
      font-size: 1.4rem;
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
      border-radius: 50%;
      background: #6eb1fe;
    }
  }
}

.services-container {
  padding: 0 10px 14vw 10px;
  .services-title {
    display: block;
    margin-bottom: calc(2px + 2vw);
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
  }
  .service-container {
    height: 100%;
    padding: 10px;
    @include box-shadow;
    border-radius: 10px;
    display: flex;
    align-items: center;
    .service-image {
      padding-right: 15px;
      height: 50px;
      img {
        width: 50px;
        height: 50px;
      }
    }
    .service-content {
      .service-title {
        padding-bottom: 3px;
        font-size: 1.2rem;
        font-weight: bold;
      }
      .service-descripcion {
        font-size: 0.9rem;
        font-weight: lighter;
      }
    }
  }
}

.secondary-container {
  padding: 0 10px 17vw 10px;
  &.secondary-principal {
    color: #fff;
  }
  .secondary-content {
    margin-bottom: 20px;
    .secondary-title {
      font-size: 1.4rem;
    }
    .secondary-description {
      margin-top: 16px;
      font-size: 1.1rem;
      font-weight: lighter;
    }
    .secondary-action {
      margin: 30px 0;
      display: block;
      color: #fff;
    }
  }
  .secondary-image {
    padding: 0 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-height: 420px;
      max-width: 100%;
      border-radius: 10px;
    }
  }
}
</style>