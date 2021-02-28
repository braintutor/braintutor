<template>
  <Layout :links="links" fluid>
    <router-view :child="child" v-if="child" />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutParent";
import { getUserById } from "@/services/userService";

export default {
  data: () => ({
    child: null,
  }),
  computed: {
    links() {
      return this.child ? [
        {
          image: require(`@/assets/icons/icon-course.svg`),
          text: "Perfil",
          name: "parent-child-info",
        },
        {
          image: require(`@/assets/icons/icon-course.svg`),
          text: "Agenda",
          name: "parent-child-calendar",
          query: {
            section_id: this.child.section_id,
          },
        },
        {
          image: require("@/assets/icons/icon-calendar.svg"),
          text: "Cursos",
          name: "parent-child-courses",
        },
      ] : [];
    },
  },
  async created() {
    let childId = this.$router.currentRoute.params["childId"];
    this.showLoading("Cargando");
    try {
      this.child = await getUserById(childId);
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    redirectChilds() {
      this.$router.push({
        name: "parent-sessions",
      });
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang="scss" scoped></style>
