<template>
  <div>
    <div v-for="(unit, unit_idx) in units" :key="unit_idx" class="unit">
      <div class="unit__menu">
        <p class="unit__name">{{ unit.name }}</p>
        <slot name="unitMenu" v-bind:unit="unit" ></slot>
      </div>
      <div class="unit__content">
        <div
          v-for="(item, idx) in unit.content"
          :key="idx"
          class="item"
          :class="{ 'item--disabled': item.material.is_private }"
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
            <v-tooltip v-if="!isReadonly && item.material.is_private" bottom >
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
           
            <slot name="materialMenu" v-bind:unit_idx="unit_idx" v-bind:unit="unit" v-bind:idx="idx" v-bind:material="item"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    units: { type: Array }, 
    isReadonly: { type: Boolean, default: false } 
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

</style>
