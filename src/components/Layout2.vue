<template>
  <div class="app">
    <!-- Header -->
    <div class="header">
      <slot name="header"></slot>
    </div>
    <!-- Sidebar -->
    <nav class="sidebar">
      <div
        v-for="(link, idx) in links"
        :key="idx"
        @click="redirect(link.name)"
        class="link"
        :class="{ 'link--active': link.name === name }"
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
      </div>
    </nav>
    <!-- Body -->
    <div id="app__body" class="app__body">
      <div class="content" :class="{ 'm-container': !fluid }">
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
    redirect(name) {
      this.$router
        .push({
          name,
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang='scss' scoped>
$sidebar-spacing: 6px;

.app {
  height: calc(100vh - 56px);
  display: grid;

  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;

  &__body {
    overflow-y: auto;
    flex-grow: 1;
  }
}

.header {
  grid-column-start: 1;
  grid-column-end: 3;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.sidebar {
  padding: $sidebar-spacing;
  width: 120px;
  overflow-y: auto;
  // border-right: 1px solid #ccc;
}

.content {
  // padding: 10px;
  height: 100%;
  margin: 0 auto;
}

.link {
  padding: 8px;
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
  flex-direction: column;
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

// @media only screen and (max-width: 2000px) {
@media only screen and (max-width: 768px) {
  .app {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
  }

  .header {
    grid-column-start: 1;
    grid-column-end: 2;
  }

  .sidebar {
    width: 100%;
    border: none;

    display: flex;
    justify-content: center;
  }

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