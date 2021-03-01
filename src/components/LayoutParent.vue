<template>
  <div>
    <div class="d-flex justify-center">
      <router-link
        active-class='link--active'
        v-for="(link, idx) in links"
        :key="idx"
        :to="redirect(link.name, link.query)"
        class="link"
      >
        <div
          class="link__image"
          :style="{
            background: `${link.color}`,
            '-webkit-mask': `url('${link.image}') no-repeat center`,
            mask: `url(${link.image}) no-repeat center`,
          }"
        ></div>
        <div class="link__name" :style="{ color: `${link.color}` }">
          {{ link.text }}
        </div>
      </router-link>
    </div>
    <div class="">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: Array,
    fluid: Boolean,
  },
  data: () => ({
    name: "",
  }),
  created() {
    this.showSelected();
  },
  watch: {
    $route() {
      this.showSelected();
    },
  },
  methods: {
    showSelected() {
      this.name = this.$route.name;
    },
    redirect(name, query) {
      return {
        name,
        query: query,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
$sidebar-spacing: 6px;

.content {
  // padding: 10px;
  height: 100%;
  margin: 0 auto;
}

.link {
  text-decoration: none;
  padding: 8px;
  margin: 5px;
  padding-top: 10px;
  margin-bottom: $sidebar-spacing;
  color: #000;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 8px;
  opacity: 0.4;
  transition: 0.3s;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--background-hover);
    opacity: 0.6;
  }

  &__image {
    display: block;
    width: 36px;
    height: 36px;
    margin-bottom: 8px;
    mask-size: cover !important;
    background: #000;
  }

  &--active {
    background: var(--background-active);
    opacity: 1;
    &:hover {
      background: var(--background-active);
      opacity: 1;
    }
    .link__image {
      background-color: var(--color-active);
    }
    .link__name {
      color: var(--color-active);
    }
  }
}

.link__name {
  text-align: center;
}

// @media only screen and (max-width: 2000px) {
@media only screen and (max-width: 768px) {
  .link {
    width: 42px;
    padding: 6px;
    margin-bottom: 0;
    &__image {
      margin: 0;
      width: 28px;
      height: 28px;
    }
    &__name {
      display: none;
    }
  }
}
</style>
