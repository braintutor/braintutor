<template>
  <div class="app">
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
    <div id="app__body" class="app__body">
      <div class="content">
        <slot name="default"></slot>
        <div v-for="(link, idx) in links" :key="idx">
          <slot v-if="link_idx === idx" :name="idx"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    links: Array
  },
  data: () => ({
    link_idx: 0
  })
};
</script>

<style lang='scss' scoped>
.app {
  height: 100%;
  display: flex;

  &__body {
    height: calc(100vh - 64px);
    overflow-y: auto;
    flex-grow: 1;
  }
}

.sidebar {
  width: 110px;
  border-right: 1px solid #ccc;
}

.content {
  max-width: 950px;
  margin: 0 auto;
}

.link {
  padding: 13px 8px 10px 8px;
  color: #707070;
  font-size: 0.75rem;
  font-weight: bold;
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
    background: #e0eaff;
    opacity: 1;
    cursor: unset;
    &:hover {
      background: #e0eaff;
      opacity: 1;
    }
  }
}

// @media only screen and (max-width: 2000px) {
@media only screen and (max-width: 768px) {
  .app {
    flex-direction: column;
    &__body {
      height: auto;
      padding: 20px 0;
    }
  }
  .sidebar {
    width: 100%;
    border: none;
    border-bottom: 1px solid #ccc;

    display: flex;
    justify-content: center;
  }

  .link {
    &__image {
      margin: 0;
    }
    &__name {
      display: none;
    }
  }
}
</style>