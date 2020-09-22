<template>
  <div class="mcontainer">
    <h1 class="mtitle">
      <v-icon class="mr-3" style="font-size: 2.4rem">mdi-bookshelf</v-icon>Mis Cursos
    </h1>
    <div class="row no-gutters">
      <div v-for="(session, idx) in sessions" :key="idx" class="col-12 col-sm-6 col-md-4 pa-3">
        <section @click="selectSession(session)" class="session">
          <div
            class="session__image"
            :style="{ backgroundImage: `url('${require('@/assets/backgrounds/banner2.jpg')}')`}"
          />
          <section class="session__body">
            <div class="session__classroom">
              <v-icon class="session__avatar">mdi-account-multiple</v-icon>
              <span>{{session.classroom.name}}</span>
            </div>
            <span class="session__course mb-7">{{session.course.name}}</span>
            <div class="session__actions">
              <button class="button">
                Ingresar
                <v-icon
                  class="ml-1"
                  style="color: var(--color-active); font-size: 1.4rem"
                >mdi-arrow-right</v-icon>
              </button>
            </div>
          </section>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { getSessionsByTeacher } from "@/services/sessionService";
import { redirect } from "@/services/router.js";

export default {
  data: () => ({
    sessions: [],
  }),
  async created() {
    this.showLoading("Cargando Cursos");
    try {
      this.sessions = await getSessionsByTeacher();
    } catch (error) {
      this.showMessage("Error", error.msg);
    }
    this.hideLoading();
  },
  methods: {
    selectSession(session) {
      redirect("session-editor", { session_id: session._id.$oid });
    },
  },
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
}

.mtitle {
  margin: 10px;
  color: #5b5b6a;
}

.session {
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: 0.4s;
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  &--disable {
    -webkit-filter: grayscale(1);
    opacity: 0.75;
  }

  &__image {
    height: 160px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__body {
    flex-grow: 1;
    padding: 10px;

    display: flex;
    flex-direction: column;
  }

  &__classroom {
    margin: 8px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
  }

  &__avatar {
    flex-shrink: 0;
    height: 28px;
    width: 28px;
    margin-right: 10px;
    background: var(--color-active);
    color: #fff;
    font-size: 1rem;
    border-radius: 50%;
  }

  &__course {
    display: block;
    margin: 4px;
    font-weight: bold;
    font-size: 1.1rem;
    letter-spacing: 0.25px;
  }

  &__actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
  }
}

.button {
  padding: 10px 12px;
  font-weight: bold;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: 0.4s;

  &:hover {
    background: #e4e4e4;
  }
  &:focus {
    outline: none;
  }
}
</style>