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
    links: [],
  }),
  computed: {},
  watch: {
    "$route.params.childId": {
      handler: async function(childId) {
        //    let childId = this.$router.currentRoute.params["childId"];

        this.getDetail(childId);
      },
      immediate: true,
    },
  },

  methods: {
    async getDetail(childId) {
      this.showLoading("Cargando");
      try {
        this.child = await getUserById(childId);
        this.links = this.getLinks(this.child.section_id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    getLinks(section_id) {
      return [
        {
          image: require(`@/assets/icons/icon-student.svg`),
          text: "Perfil",
          name: "parent-child-info",
        },
        {
          image: require(`@/assets/icons/icon-calendar.svg`),
          text: "Agenda",
          name: "parent-child-calendar",
          query: {
            section_id,
          },
        },
        {
          image: require("@/assets/icons/icon-course.svg"),
          text: "Cursos",
          name: "parent-child-courses",
        },
      ];
    },
  },
  components: {
    Layout,
  },
};
</script>

<style lang="scss" scoped></style>
