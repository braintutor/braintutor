<template>
  <Layout :links="links" fluid>
    <section slot="header2">
      <span class="m-path__name ">{{ course.name }}</span>
    </section>
    <router-view v-if="course._id" :course="course" />
  </Layout>
</template>

<script>
import Layout from "@/components/Layout2";

export default {
  data: () => ({
    course: {},
    links: [
      {
        image: require(`@/assets/icons/icon-course.svg`),
        text: "Material de clase",
        name: "parent-session-learn",
      },
      {
        image: require(`@/assets/icons/icon-task.svg`),
        text: "Tareas",
        name: "parent-session-tasks",
      },
      {
        image: require("@/assets/icons/icon-evaluation.svg"),
        text: "Notas",
        name: "parent-session-evaluations",
      },
      {
        image: require("@/assets/icons/icon-student.svg"),
        text: "Perfil de aprendizaje",
        name: "parent-session-students",
      },
    ],
  }),
  async created() {
    let session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("Cargando");
    try {
      let session = await this.$api.session.get(session_id);
      this.course = session.course;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  components: {
    Layout,
  },
  methods: {
    redirectCourses() {
      this.$router.push({
        name: "parent-child-courses",
      });
    },
  },
};
</script>

