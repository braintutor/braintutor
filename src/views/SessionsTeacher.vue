<template>
  <div class="mcontainer">
    <h1 class="mtitle">
      <v-icon class="mr-3" style="font-size: 2.4rem">mdi-bookshelf</v-icon>Mis Cursos
    </h1>
    <div class="row">
      <div v-for="(session, idx) in sessions" :key="idx" class="col-12 col-sm-6 col-md-4">
        <section @click="selectSession(session)" class="session">
          <div
            class="session__image"
            :style="{ backgroundImage: `url('${session.image || 'https://images.clipartlogo.com/files/istock/previews/1074/107415123-back-to-school-themed-doodle-background-school-doodles-vector-set.jpg'}')` }"
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
                  style="color: rgb(85, 83, 255); font-size: 1.4rem"
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

import { mapMutations } from "vuex";

export default {
  data: () => ({
    sessions: []
  }),
  async created() {
    this.loading(true);
    this.loading_msg("Cargando Cursos");

    try {
      this.sessions = await getSessionsByTeacher();
    } catch (error) {
      this.$root.$children[0].showMessage("Error", error.msg);
    }
    this.loading(false);
  },
  methods: {
    ...mapMutations(["loading", "loading_msg"]),
    selectSession(session) {
      redirect("session-editor", { session_id: session._id.$oid });
    }
  }
};
</script>

<style lang='scss' scoped>
.mcontainer {
  max-width: 950px;
  margin: 0 auto;
}

.mtitle {
  margin: 10px 4px;
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
    height: 30px;
    width: 30px;
    margin-right: 10px;
    background: #5553ff;
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