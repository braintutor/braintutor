<template>
  <div>
    <div v-for="(unit, unit_idx) in units" :key="unit_idx" class="unit">
      <div
        class="unit__menu"
        @click="
          unit.show = !unit.show;
          $forceUpdate();
        "
      >
        <p class="unit__name">{{ unit.name }}</p>
        <v-icon class="list__show" :class="{ 'list__show--active': unit.show }"
          >mdi-chevron-down</v-icon
        >
        <slot name="unitMenu" v-bind:unit="unit"></slot>
      </div>
      <div class="unit__content" v-show="unit.show">
        <div
          v-for="(item, idx) in unit.content"
          :key="idx"
          @click="select(item)"
          class="d-flex justify-space-between"
          :class="{
            'item': !isReadonly,
            'link': isReadonly,
            'item--disabled': item.material.is_private,
            'link--active': selectedMaterial && item.material.id === selectedMaterial.id,
          }"
        >
          <p class="item__name">
            <v-icon style="font-size: 1.2rem" class="mb-1 mr-2">{{
              item.material.type === "adaptative"
                ? "mdi-robot"
                : "mdi-paperclip"
            }}</v-icon>
            {{ item.material.title }}
          </p>
          <div class="item__actions d-flex">
            <v-tooltip v-if="item.material.is_private" bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  icon
                  small
                  class="mr-4"
                  style="font-size: 1.3rem"
                >
                  mdi-eye-off-outline
                </v-icon>
              </template>
              <span>Privado</span>
            </v-tooltip>

            <slot
              name="materialMenu"
              v-bind:unit_idx="unit_idx"
              v-bind:unit="unit"
              v-bind:idx="idx"
              v-bind:material="item"
            ></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedMaterial: { type: Object },
    units: { type: Array },
    isReadonly: { type: Boolean, default: false },
  },
  data: () => ({
  }),
  methods: {
    select(material) {
      this.$emit("selected", material);
    },
  },
};
</script>

<style lang="scss" scoped>
.unit {
  margin-bottom: 24px;
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__name {
    padding: 6px 4px;
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
  }
}

.item {
  padding: 12px 20px;
  margin-top: 8px;
  background: #dfdfdf;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__name {
    margin: 0;
    font-weight: bold;
  }

  &--disabled {
    background: #f0f0f0e7;
    .item__name {
      opacity: 0.5;
    }
  }
}

.link {
  margin: 6px;
  padding: 10px 12px;
  color: #414141;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: var(--background-hover);
  }

  &--active {
    color: var(--color-active);
    background: var(--background-active);
    // font-weight: bold;
    &:hover {
      background: var(--background-active);
    }

    & * {
      color: var(--color-active);
    }
  }
}

.list {
  overflow-y: auto;
  flex-shrink: 0;
  height: 100%;
  width: 320px;

  &__title {
    font-weight: bold;
    font-size: 1.5rem;
    margin: 16px 24px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__show {
    font-size: 2rem;
    border-radius: 50%;

    &:hover {
      background: #e5e5e5;
    }

    &:focus {
      outline: none;
    }

    &--active {
      transform: rotate(180deg);
    }
  }
}
</style>
