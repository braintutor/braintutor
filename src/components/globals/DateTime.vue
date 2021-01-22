<template>
  <v-datetime-picker
    v-model="dateTime"
    :date-picker-props="{ locale: 'es-ES' }"
    :disabled="disabled"
    :text-field-props="textFieldProps"
  >
    <template slot="dateIcon">
      <v-icon>mdi-calendar</v-icon>
    </template>
    <template slot="timeIcon">
      <v-icon>mdi-clock-outline</v-icon>
    </template>
    <template slot="actions" slot-scope="{ parent }">
      <!-- <v-btn small class="cancel-button" @click="parent.clearHandler"
        >Cancelar</v-btn
      > -->
      <v-btn small color="primary" @click="parent.okHandler">Aceptar</v-btn>
    </template>
  </v-datetime-picker>
</template>

<script>
export default {
  data() {
    return {
      textFieldProps: { prependInnerIcon: "mdi-calendar" },
    };
  },
  props: {
    value: Date,
    disabled: { type: Boolean, default: false },
  },
  computed: {
    dateTime: {
      get() {
        return this.value;
      },
      set(dateTime) {
        this.$emit("input", dateTime);
      },
    },
  },
};
</script>

<style lang='scss' scoped>
.cancel-button {
  background: none;
  border: 1px solid gray;
}
</style>