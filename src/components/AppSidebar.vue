<template>
  <div class="app-sidebar">
    <div class="sidebar">
      <div class="sidebar__links">
        <div v-for="(link, l_idx) in links" :key="l_idx">
          <input type="radio" :id="l_idx" :value="l_idx" v-model="idx" />
          <label :for="l_idx" class="sidebar__link">
            <img :src="link.image" />
            <span v-if="link.text" class="sidebar__link-name">{{link.text}}</span>
          </label>
        </div>
      </div>
    </div>
    <div class="content">
      <slot name="default"></slot>
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
  props: ["links"], // {image: '', text: ''}
  data: () => ({
    idx: 0
  })
};
</script>

<style lang='scss' scoped>
@import "@/styles/box-shadow";

$color-selected: #f6f6fd;
$color-hover: #fbfbff;
$color-selected-border: #3968eb;
$color-hover-border: #a7b9ec;

.app-sidebar {
  padding-top: 0;
  margin: 0 16px;
  display: flex;
}

.sidebar {
  margin-right: 20px;
  &__links {
    overflow: hidden;
    height: min-content;
    padding: 7px 0;
    margin-bottom: 14px;
    border-radius: 10px;
    @include box-shadow;

    &:hover {
      .sidebar__link-name {
        max-width: 170px;
        margin-right: 8px;
        opacity: 1;
        pointer-events: all;
      }
    }
  }
  &__link {
    $self: &;
    display: flex;
    align-items: center;
    border-left: 3px solid #ffffff00;
    border-right: 3px solid #ffffff00;
    transition: all 0.5s;
    img {
      margin: 8px;
      width: 30px;
      height: 30px;
      vertical-align: bottom;
    }
    &-name {
      white-space: nowrap;
      max-width: 0;
      color: #3b3b3b;
      font-size: 0.95rem;
      font-weight: bold;
      opacity: 0;
      transition: all 0.8s, margin 0.5s;
      pointer-events: none;
    }
    &:hover {
      cursor: pointer;
      background: $color-hover;
      border-left: 3px solid $color-hover-border;
    }
  }
}
input[type="radio"] {
  display: none;
  &:checked + .sidebar__link {
    background: $color-selected;
    border-left: 3px solid $color-selected-border;
    opacity: 1;
  }
}

.content {
  height: min-content;
  margin-bottom: 10px;
  flex-grow: 1;
}

@media only screen and (max-width: 768px) {
  .app-sidebar {
    margin: 8px;
    margin-top: 0;
    flex-direction: column;
  }

  .sidebar {
    display: flex;
    margin: 0 auto;
    &__links {
      margin-bottom: 12px;
      width: min-content;
      padding: 0 3px;
      display: flex;
    }
    &__link {
      border-left: none;
      border-right: none;
      margin: 0 3px;
      img {
        margin: 6px;
        width: 30px;
        height: 30px;
      }
      &-name {
        display: none;
      }
      &:hover {
        border-left: none;
        border-bottom: 3px solid $color-hover-border;
        cursor: pointer;
        opacity: 1;
      }
    }
  }
  input[type="radio"] {
    &:checked + .sidebar__link {
      border-left: none;
      border-bottom: 3px solid $color-selected-border;
    }
  }
}
</style>