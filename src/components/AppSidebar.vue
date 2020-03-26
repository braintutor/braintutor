<template>
  <div class="app-sidebar">
    <div class="sidebar">
      <div v-for="(link, l_idx) in links" :key="l_idx">
        <div class="sidebar__link transform-scale-plus" @click="idx = l_idx">
          <img :src="link.image" />
          <span class="sidebar__link-name">{{link.text}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <template v-for="(link, l_idx) in links">
        <div v-if="idx === l_idx" :key="l_idx">
          <slot :name="l_idx"></slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: ["links"],
  data: () => ({
    idx: 0
  })
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.app-sidebar {
  padding-top: 0;
  margin: 0 20px;
  display: flex;
}

.sidebar {
  height: min-content;
  padding: 0 8px;
  margin-right: 20px;
  border-radius: 10px;
  @include box-shadow;

  &__link {
    display: flex;
    align-items: center;
    margin: 16px 6px;
    img {
      width: 40px;
      height: 40px;
      vertical-align: bottom;
    }
    &-name {
      margin:  0 6px 0 12px;
      color: #a0a0a0;
      font-size: 1.1rem;
      font-weight: bold;
    }
    &:hover {
      cursor: pointer;
    }
  }
}
.content {
  height: min-content;
  padding: 10px;
  flex-grow: 1;
  border-radius: 10px;
  @include box-shadow;
}

@media only screen and (max-width: 768px) {
  .app-sidebar {
    flex-direction: column;
  }

  .sidebar {
    width: min-content;
    padding: 8px 6px;
    margin: 0 auto 12px auto;
    display: flex;
    &__link {
      margin: 0 6px;
      img {
        width: 36px;
        height: 36px;
      }
      &-name {
        display: none;
      }
    }
  }
}
</style>