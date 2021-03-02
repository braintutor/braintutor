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
				/>
			</v-col>
			<v-col>
				<date-input
					label="Fin"
					:date-picker-props="{min: segment.start.value, 'show-current': segment.start.value}"
					v-model="segment.end.value"
				/>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import DateInput from './DateInput';
import {displayType} from '@/services/schoolCycleService';

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
		showCurrent(segment) {
			const segmentIndex = this.segments.indexOf(segment);
			if (segmentIndex == 0) return true; // if first return current date

			const lastSegment = this.segments[segmentIndex - 1];
			return lastSegment.end;
		},
		displayNumber(number) {
			switch (number) {
				case 2:
					return 'II';
				case 3:
					return 'III';
				case 4:
					return 'IV';
				default:
					return 'I';
			}
		},
		formatSegment2(type, number) {
			return displayType(type) + ' ' + this.displayNumber(number);
		},
	},
};
</script>

<style></style>
