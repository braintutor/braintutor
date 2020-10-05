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
        @click="link_idx = idx"
        class="link"
        :class="{'link--active': idx === link_idx}"
      >
        <img :src="link.image" class="link__image" />
        <div class="link__name">{{link.name}}</div>
      </div>
    </nav>
    <!-- Body -->
    <div id="app__body" class="app__body">
      <div class="content" :class="{'m-container': !fluid}">
        <slot name="default"></slot>
        <template v-for="(link, idx) in links">
          <slot v-if="link_idx === idx" :name="idx" style="height: 100%"></slot>
        </template>
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
    link_idx: 0,
  }),
};
</script>

<style lang='scss' scoped>
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
  padding: 8px;
  width: 120px;
  // border-right: 1px solid #ccc;
}

.content {
  // padding: 10px;
  height: 100%;
  margin: 0 auto;
}

.link {
  padding: 13px 8px 10px 8px;
  margin-bottom: 8px;
  color: #707070;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 8px;
  opacity: 0.5;
  transition: 0.3s;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    background: #ebf1ff;
    opacity: 0.75;
  }

  &__image {
    display: block;
    width: 26px;
    height: 26px;
    margin-bottom: 10px;
  }

  &--active {
    background: #e8efff;
    opacity: 1;
    &:hover {
      background: #e8efff;
      opacity: 1;
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
    width: 48px;
    padding: 8px;
    margin-bottom: 0;
    &__image {
      margin: 0;
    }
    &__name {
      display: none;
    }
  }
}
</style>