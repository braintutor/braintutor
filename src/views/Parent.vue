<template>
  <div class="px-2">
    <div class="student__title">
      <!-- <span :class="{'disable': !show_courses}" @click="show_courses = true">Mis Cursos</span> -->
      <!-- <span class="mx-2"></span> -->
      <span :class="{'disable': show_courses}" @click="show_courses =  false">Tareas</span>
    </div>
    <Sessions v-if="show_courses" />
    <Tasks v-else />
  </div>
</template>

<script>
import Sessions from "@/components/Student/Sessions";
import Tasks from "@/components/Student/Tasks";

export default {
  data: () => ({
    show_courses: false
  }),
  components: {
    Sessions,
    Tasks
  }
};
</script>

<style lang='scss' scoped>
.student__title {
  margin: 10px 0 16px 0;
  color: #000;
  text-align: center;
  font-size: 2.4rem;
  font-weight: lighter;
  .disable {
    cursor: pointer;
    color: #dadada;
    font-size: 1.2rem;
    transition: all 0.3s;
    &:hover {
      color: #8d8d8d;
    }
  }
}
</style>