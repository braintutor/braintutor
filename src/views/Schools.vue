<template>
  <div>
    <div class="schools">
      <div
        v-for="(school, idx) in schools"
        :key="idx"
        @click="selectSchool(school)"
        class="school m-card"
      >
        <div class="school__image">
          <img :src="school.image" />
        </div>
        <strong class="school__name">{{ school.name }}</strong>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    schools: [],
  }),
  async created() {
    this.showLoading("Cargando");
    try {
      this.schools = await this.$api.school.getAll();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    selectSchool(school) {
      this.$router.push({
        name: "login",
        params: {
          school_url: school.url,
        },
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.schools {
  max-width: 600px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 20px;
}

.school {
  transition: 0.3s;
  box-shadow: 0 5px 15px 0px rgba(0, 0, 0, 0.15);
  cursor: pointer;

  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px 0px rgba(0, 0, 0, 0.15);
  }

  &__image {
    flex-grow: 1;

    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
    }
  }
  &__name {
    display: block;
    padding: 18px 24px;
    text-align: center;
  }
}
</style>