<template>
  <v-dialog v-model="isVisible" :max-width="maxWidth" persistent>
    <form @submit.prevent="$emit('submit')" class="m-card">
      <div class="m-card__body">
        <slot name="body"></slot>
      </div>
      <div class="m-card__actions">
        <m-btn
          v-if="!loading && showCancel"
          @click="cancel()"
          type="button"
          small
          text
          class="cancel-button"
          >Cancelar</m-btn
        >
        <slot name="actions"></slot>
      </div>
    </form>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    maxWidth: { type: String, default: "600" },
    showCancel: { type: Boolean, default: true },
  },
  computed: {
    isVisible: {
      get() {
        return this.value;
      },
      set(isVisible) {
        this.$emit("input", isVisible);
      },
    },
  },
  methods: {
    cancel() {
      this.isVisible = false;
      this.$emit("cancel", true);
    },
  },
};
</script>

<style lang="scss" scoped>
.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}
</style>