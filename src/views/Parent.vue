<template>
  <div >
    <div class="m-container">
      <v-select
        :value="student_id"
        :items="students"
        item-value="_id"
        item-text="name"
        label="Hijo:"
        @change="showChildDetail"
        class="px-2 mb-3 text-center"
      ></v-select>
    </div>
    <div>
      <router-view></router-view>
    </div>
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
      handler: async function({ childId }) {
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

      if(this.students.length > 0) this.showChildDetail(this.students[0]["_id"])
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    showChildDetail(id) {
      this.student_id = id
      this.$router.push({ name: "parent-child-info", params: { childId: id } });
    },
  },
  components: {},
};
</script>
