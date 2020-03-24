<template>
  <div class="app-sidebar container">
    <div class="sidebar">
      <div v-for="(link, l_idx) in links" :key="l_idx">
        <div class="sidebar__link transform-scale-plus" @click="idx = l_idx">
          <img :src="link.image" />
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
    idx: 3
  })
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

.app-sidebar {
  padding-top: 0;
  display: flex;
}

.sidebar {
  height: min-content;
  padding: 0 8px;
  margin-right: 20px;
  border-radius: 10px;
  @include box-shadow;

  &__link {
    margin: 16px 0;
    img {
      width: 40px;
      height: 40px;
      vertical-align: bottom;
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
    }
  }
}
</style>