<template>
	<v-container>
		<v-row v-for="(segment, index) in segments" :key="segment.number" class="d-flex justify-space-around">
			<v-col cols="3" class="d-flex align-center">
				<h4>{{ formatSegment2(type, segment.number) }}</h4>
			</v-col>
			<v-col>
				<date-input
					label="Inicio"
					:date-picker-props="{
						min: segment.start.min,
						'show-current': showCurrent(segment)
					}"
					v-model="segment.start.value"
					@input="updateNextSegments(index)"
				/>
			</v-col>
			<v-col>
				<date-input
					label="Fin"
					:date-picker-props="{
						min: segment.start.value,
						max: nextDate(segment.start.value),
						'show-current': false
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
			return lastSegment.end.value;
		},
		nextDate(fecha) {
			let res = fecha.split('-');
			let max =
				res[0] +
				'-' +
				fill0Number(returnMesNumber(res[1]) + (numberType(this.type) + 2)) +
				'-' +
				res[2];
			return max;
		},
		updateNextSegments(indexI){
			this.segments[indexI].end.value = this.nextDate(this.segments[indexI].start.value);
			for (let index = indexI+1; index < this.segments.length; index++) {
				this.segments[index].start.value = this.segments[index - 1].end.value;
				this.segments[index].end.value =this.nextDate(this.segments[index].start.value);
			}
		}
	},
};
</script>

<style></style>
