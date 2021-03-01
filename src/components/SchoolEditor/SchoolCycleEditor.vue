<template>
	<div class="editor">
		<div class="editor__menu d-flex justify-space-between align-center">
			<div class="editor__title d-flex align-center">
				<h2>Ciclos escolares</h2>
			</div>
			<m-btn color="primary" small @click="isEditDialogVisible = true">
				<v-icon small class="mr-2">mdi-plus</v-icon>Crear
			</m-btn>
		</div>
		<div class="editor__content mt-4">
			<table class="m-table">
				<thead>
					<tr>
						<th class="text-left">Año</th>
						<th class="text-left">Fecha de inicio</th>
						<th class="text-left">Fecha de Fin</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="schoolCycle of schoolCycles" :key="schoolCycle.id">
						<td>{{ schoolCycle.year }}</td>
						<td>{{ schoolCycle.start | date }}</td>
						<td>{{ schoolCycle.end | date }}</td>
						<td>
							<v-tooltip bottom>
								<template v-slot:activator="{on, attrs}">
									<v-btn
										color="primary"
										icon
										v-bind="attrs"
										v-on="on"
										:to="'schedulers/' + schoolCycle.id"
									>
										<v-icon>mdi-magnify</v-icon>
									</v-btn>
								</template>
								<span>Ver ciclo escolar</span>
							</v-tooltip>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<brain-dialog v-model="isEditDialogVisible" @submit="save" :loading="loading_save">
			<template #body>
				<div class="close-modal">
					<h3>Crear</h3>
					<v-btn class="mx-2" icon small @click="isEditDialogVisible = false">
						<v-icon> mdi-close-thick </v-icon>
					</v-btn>
				</div>
				<v-text-field label="Año escolar" v-model="year" />
				<v-tabs v-model="tab" grow @change="changeSegments">
					<v-tab key="bimester">Bimestral</v-tab>
					<v-tab key="trimester">Trimestral</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab">
					<v-tab-item key="bimester">
						<school-cycle-segments v-model="segments" type="bimester" />
					</v-tab-item>
					<v-tab-item key="trimester">
						<school-cycle-segments v-model="segments" type="trimester" />
					</v-tab-item>
				</v-tabs-items>
			</template>
			<template #actions>
				<m-btn color="primary" type="submit" :loading="loading_save" small>Guardar</m-btn>
			</template>
		</brain-dialog>
	</div>
</template>

<script>
import BrainDialog from './BrainDialog';
import SchoolCycleSegments from './SchoolCycleSegments.vue';
import {createSchoolCycle, getSchoolCycles} from '@/services/schoolCycleService';

export default {
	components: {
		BrainDialog,
		SchoolCycleSegments,
	},
	data() {
		return {
			isEditDialogVisible: false,
			loading_save: false,
			tab: 0, // 0 == bimester, 1 == trimester
			segments: this.getSegments(0),
			year: new Date().getFullYear().toString(),
			schoolCycles: [],
		};
	},
	mounted() {
		getSchoolCycles().then((x) => (this.schoolCycles = x));
	},
	methods: {
		async save() {
			this.showLoading('Registrando ciclo escolar');
			try {
				let schoolCycle = await createSchoolCycle(this.year, this.getSegmentType(), this.segments);
				console.log(schoolCycle);
				this.schoolCycles.push(schoolCycle);
				this.showMessage(
					'Ciclo Registrado',
					'Ciclo del año ' + schoolCycle.year + ' registrado exitosamente',
				);
			} catch (error) {
				this.showMessage('', error.msg || error);
			}
			this.hideLoading();
		},
		getSegmentType() {
			return this.tab == 0 ? 'bimester' : 'trimester';
		},
		changeSegments(tab) {
			this.segments = this.getSegments(tab);
		},
		getSegments(tab) {
			const numbers = tab == 0 ? ['I', 'II', 'III', 'IV'] : ['I', 'II', 'III'];
			return numbers.map((x) => ({number: x, start: null, end: null}));
		},
	},
};
</script>

<style lang="scss">
.editor {
	padding: 10px 16px;

	&__content {
		overflow-x: auto;
	}
}

// TODO: move to brain-dialog
.close-modal {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
