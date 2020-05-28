<template>
  <div>
    <div class="menu pa-0 pb-1">
      <div class="menu-left">
        <v-btn icon @click="unselect(); restore()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="menu-title">Ver Tareas</span>
      </div>
    </div>
    <div class="task m-card">
      <div class="task__menu">
        <div>
          <p class="task__time_start">{{task.time_start_f}}</p>
          <p class="task__title">{{task.title}}</p>
        </div>
      </div>
      <p class="task__description">{{task.description}}</p>
    </div>
    <!-- ANSWERS -->
    <p style="font-weight: bold; font-size: 1.2rem" class="ml-2 mt-6 mb-3">Respuestas</p>
    <div class="row no-gutters">
      <!-- STUDENTS -->
      <div class="students m-card col-12 col-sm-2 mb-3">
        <div class="student" v-for="(s, idx) in students" :key="idx" @click="student = s">
          <span>{{`${s.last_name}, ${s.first_name}`}}</span>
        </div>
      </div>
      <!-- ANSWER -->
      <div v-if="student" class="col-12 col-sm-10">
        <div class="response m-card mb-4 ml-sm-5">
          <p class="response__student">{{`${student.last_name}, ${student.first_name}`}}</p>
          <div v-if="answer.length > 0" class="response__answer">
            <div class="mt-3" v-for="(item, idx) in answer" :key="idx">
              <div class="link" v-if="item.type === 'link'">
                <a class="link__data" :href="item.url" target="_blank">
                  <img class="link__image" :src="item.image" alt />
                  <p class="link__title">{{item.title}}</p>
                  <p class="link__description">{{item.description}}</p>
                </a>
              </div>
            </div>
          </div>
          <div v-else class="text-center mt-2" style="color: #aaa">No hay respuestas.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["task", "students", "unselect", "restore"],
  data: () => ({
    session_id: "",
    student: null
  }),
  mounted() {
    this.student = this.students[0];
  },
  computed: {
    answer() {
      let answer = [];
      try {
        answer = this.task.answers[this.student._id.$oid] || [];
      } catch (error) {
        //
      }
      return answer;
    }
  },
  methods: {}
};
</script>

<style lang='scss' scoped>
.task {
  margin-bottom: 16px;
  &__menu {
    padding: 12px 10px 0 18px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  &__time_start {
    margin-bottom: 2px;
    color: #a0a0a0;
    font-size: 0.75rem;
  }
  &__title {
    margin-bottom: 0;
    font-size: 1.3rem;
    font-weight: bold;
  }
  &__description {
    padding: 12px 18px 16px 18px;
    margin-bottom: 0;
    font-size: 0.95rem;
  }
}

.students {
  overflow: hidden;
  height: min-content;
}
.student {
  padding: 6px 10px;
  font-size: 0.75rem;
  transition: all 0.3s;
  border-bottom: 0.5px solid #e0e0e0;
  cursor: pointer;
  &:hover {
    background: #e7e7e7;
  }
}

.response {
  padding: 12px;
  &__menu {
    display: flex;
    justify-content: flex-end;
  }
  &__student {
    margin-bottom: 0;
    font-weight: bold;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

// ANSWERS
.link {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
  overflow: hidden;
  //
  display: flex;
  align-items: center;

  &:hover {
    box-shadow: 0 2px 6px #ccc;
  }
  &__data {
    flex-grow: 1;
    color: #494949;
    text-decoration: none;
    //
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;
    column-gap: 12px;
    row-gap: 6px;
    align-items: center;
  }
  &__image {
    max-width: 80px;
    grid-row-start: 1;
    grid-row-end: 3;
    grid-column-start: 1;
  }
  &__title {
    margin: 0;
    font-size: 1rem;
    font-weight: bold;
    grid-column-start: 2;
  }
  &__description {
    margin: 0;
    font-size: 0.9rem;
    font-weight: lighter;
    grid-column-start: 2;
  }
}
</style>