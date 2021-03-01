<template>
  <div v-if="student">
    <Student :student="student" />
  </div>
</template>

<script>
import Student from "@/components/globals/Students/Student";
import { getStudentById } from "@/services/studentService";

export default {
  props: {},
  data: () => ({
    student: null,
  }),
  watch: {
    "$route.params": {
      handler: async function({ childId }) {
        this.getDetail(childId);
      },
      immediate: true,
    },
  },
  mounted() {},
  computed: {},
  methods: {
    async getDetail(id) {
      this.student = await getStudentById(id);
    },
  },
  components: {
    Student,
  },
};
</script>

<style lang="scss" scoped></style>
