<template>
  <Layout :links="links" :base="base" fluid>
    <router-view />
  </Layout>
</template>

<script>
import Layout from "@/components/LayoutLinks";

export default {
  data: () => ({
    base: "director",
    links: [
      {
        image: require(`@/assets/icons/icon-classroom.svg`),
        text: "Aulas",
        name: "",
      },
      {
        image: require(`@/assets/icons/icon-student.svg`),
        text: "Alumnos",
        name: "students",
      },
    ],
  }),
  components: {
    Layout,
  },
};
</script>

<style lang='scss' scoped>
.no-available {
  margin-top: 20px;
  color: #b3b3b3;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>