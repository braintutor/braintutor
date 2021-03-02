<template>
	<v-container>
		<v-row v-for="segment in segments" :key="segment.number" class="d-flex justify-space-around">
			<v-col cols="3" class="d-flex align-center">
				<h4>{{ formatSegment2(type, segment.number) }}</h4>
			</v-col>
			<v-col>
				<date-input
					label="Inicio"
					:date-picker-props="{
						min: segment.start.min,
						'show-current': showCurrent(segment),
					}"
					v-model="segment.start.value"
					@input="segment.end.value = calculateMax(segment.start.value)"
				/>
			</v-col>
			<v-col>
				<date-input
					label="Fin"
					:date-picker-props="{
						min: segment.start.value,
						max: calculateMax(segment.start.value),
						'show-current': segment.end.value,
					}"
					v-model="segment.end.value"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import DateInput from './DateInput';
import {
	displayType,
	fill0Number,
	returnMesNumber,
	numberType,
	displayNumber
} from '@/services/schoolCycleService';

export default {
	components: {
		DateInput,
	},
	props: {
		value: Array,
		type: String,
	},
	computed: {
		segments: {
			get() {
				return this.value;
			},
			set(date) {
				this.$emit('input', date);
			},
		},
	},
	methods: {
		displayType,
		formatSegment2(type, number) {
			return displayType(type) + ' ' + displayNumber(number);
		},
		showCurrent(segment) {
			const segmentIndex = this.segments.indexOf(segment);
			if (segmentIndex == 0) return true; // if first return current date

			const lastSegment = this.segments[segmentIndex - 1];
			return lastSegment.end;
		},
		calculateMax(fecha) {
			let res = fecha.split('-');
			let max =
				res[0] +
				'-' +
				fill0Number(returnMesNumber(res[1]) + (numberType(this.type) + 2)) +
				'-' +
				res[2];
			return max;
		},
	},
};
</script>

<style></style>
