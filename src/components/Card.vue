<template>
  <div
    class="card m-card"
    :style="{'border-top': '4px solid ' + (color || '#ecdd84')}"
    :class="{'transform-scale cursor-pointer':  callback}"
    @click="action()"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["callback", "color"],
  methods: {
    action() {
      if (this.callback) this.callback();
    }
  }
};
</script>

<style lang='scss'>
@import "@/styles/box-shadow";

.card {
  padding: 5%;
  padding-bottom: 2%;
}
.card-item {
  padding: 0 4px;
  margin-bottom: 2% !important;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
}
.card-value {
  padding: 6px 12px;
  margin-bottom: 2% !important;
  background: #f1f1f1;
  font-size: 0.9rem;
  font-weight: lighter;
  text-align: center;
  border-radius: 10px;
}
.card-divider {
  padding-bottom: 4% !important;
}
.card-actions {
  margin-bottom: 4% !important;
  display: flex;
  // display: grid;
  // grid-template-columns: repeat(2, 1fr);
  -webkit-column-gap: 8px;
}
.card-action {
  flex-grow: 1;
  padding: 6px 12px;
  margin: 0 2px;
  background: #ecdd84;
  color: #fff;
  font-size: 0.9rem;
  font-weight: bold;
  text-align: center;
  border-radius: 10px;
  -webkit-tap-highlight-color: transparent;
  @include box-shadow;
  &:hover {
    background: #e0d177;
    box-shadow: none !important;
  }
  &:focus {
    outline: none;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>