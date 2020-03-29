<template>
  <div class="app-sidebar">
    <div class="sidebar">
      <div v-for="(link, l_idx) in links" :key="l_idx">
        <input type="radio" :id="l_idx" :value="l_idx" v-model="idx" />
        <label :for="l_idx" class="sidebar__link">
          <img :src="link.image" />
          <span v-if="link.text" class="sidebar__link-name">{{link.text}}</span>
        </label>
      </div>
    </div>
    <div class="content">
      <template v-for="(link, l_idx) in links">
        <div v-show="idx === l_idx" :key="l_idx">
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
  // padding: 0 8px;
  margin-right: 20px;
  border-radius: 10px;
  @include box-shadow;

  &__link {
    $self: &;
    display: flex;
    align-items: center;
    padding: 12px;
    transition: opacity 0.3s;
    opacity: 0.4;
    img {
      width: 40px;
      height: 40px;
      vertical-align: bottom;
    }
    &-name {
      width: max-content;
      margin: 0 5px 0 12px;
      color: #3b3b3b;
      font-size: 1.2rem;
      font-weight: bold;
      transition: all 0.1s;
    }
    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
}
input[type="radio"] {
  display: none;
  &:checked + .sidebar__link {
    opacity: 1;
  }
}

.content {
  height: min-content;
  margin-bottom: 20px;
  flex-grow: 1;
}

@media only screen and (max-width: 768px) {
  .app-sidebar {
    flex-direction: column;
  }

  .sidebar {
    width: min-content;
    margin: 0 auto 12px auto;
    display: flex;
    &__link {
    padding: 6px;
      img {
        width: 32px;
        height: 32px;
      }
      &-name {
        display: none;
      }
    }
  }
}
</style>