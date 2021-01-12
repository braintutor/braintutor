<template>
    <v-datetime-picker v-model="dateTime"
        :date-picker-props="{'locale': 'es-ES'}"
        :disabled="disabled"
    >
        <template slot="dateIcon">
        <v-icon>mdi-calendar</v-icon>
        </template>
        <template slot="timeIcon">
        <v-icon>mdi-clock-outline</v-icon>
        </template>
    </v-datetime-picker>
</template>

<script>
export default {
    props: {
        value: Date,
        disabled: { type: Boolean, default: false }
    },
    computed: {
        dateTime: {
            get() { return this.value },
            set(dateTime) {this.$emit('input', dateTime)}
        }
    }
}
</script>

<style>

</style>