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
        @click="$emit('input', idx); link.action()"
        class="link"
        :class="{'link--active': idx === value}"
      >
        <img :src="link.image" class="link__image" />
        <div class="link__name">{{link.name}}</div>
      </div>
    </nav>
    <!-- Body -->
    <div id="app__body" class="app__body">
      <div class="content" :class="{'m-container': !fluid}">
        <slot name="default"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: Number,
    links: Array,
    fluid: Boolean
  }
};
</script>

<style lang='scss' scoped>
.app {
  height: calc(100vh - 64px);
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
  // box-shadow: 0 2px 3px #ccc;
  border-bottom: 1px solid #ccc;
  z-index: 1;
}

.sidebar {
  width: 110px;
  border-right: 1px solid #ccc;
}

.content {
  // padding: 10px;
  height: 100%;
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
    &:hover {
      background: #e0eaff;
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
    &__image {
      margin: 0;
    }
    &__name {
      display: none;
    }

    &--active {
      background: none;
      border-bottom: 3px solid #5553ff;
    }
  }
}
</style>