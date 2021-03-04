<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data: () => ({
    students: [],
    student_id: null,
    sessions: [],
  }),
  watch: {
    "$route.params": {
      handler: async function ({ childId }) {
        this.student_id = childId;
      },
      immediate: true,
    },
  },
  async created() {
    this.showLoading("Cargando Alumnos");
    try {
      this.students = this.mongoArr(await this.$api.student.getAll({}));
      this.students.forEach((student) => {
        student.name = `${student.last_name}, ${student.first_name}`;
      });
      if (this.students.length > 0) this.sendChilds();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  destroyed() {
    this.$root.$emit("Sesion del padre", []);
  },
  methods: {
    sendChilds() {
      let links = this.students.map((student) => ({
        id: student._id,
        title: student.name,
        url: { name: "parent-child-info", params: { childId: student._id } },
      }));
      this.$root.$emit("Sesion del padre", links);
    },
  },
  components: {},
};
</script>
