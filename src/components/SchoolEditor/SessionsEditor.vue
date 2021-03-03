<template>
	<div class="editor">
		<!-- EDITOR Menu -->
		<div class="editor__menu">
			<div class="editor__title">
				<h2>Sesiones</h2>
			</div>
			<m-btn v-if="query.section_id" @click="showCreate()" color="primary" small>
				<v-icon left small>mdi-plus</v-icon>Crear
			</m-btn>
		</div>
		<SessionFilter @query="filter"></SessionFilter>
		<!-- SESSIONS -->
		<div class="mt-3">
			<div v-for="(e, idx) in entities" :key="idx" class="session mb-3">
				<div class="session__body">
					<span>{{ e.course.name }}</span>
					<span>{{ `${e.teacher.last_name}, ${e.teacher.first_name}` }}</span>
				</div>
				<v-menu offset-y>
					<template v-slot:activator="{on}">
						<v-btn class="mx-3" icon small v-on="on">
							<v-icon>mdi-dots-vertical</v-icon>
						</v-btn>
					</template>
					<v-list class="pa-0" dense>
						<v-list-item @click="showEdit(e)">
							<v-list-item-title>Asignar Docente</v-list-item-title>
						</v-list-item>
						<v-list-item @click="showRemove(e)">
							<v-list-item-title>Eliminar Sesión</v-list-item-title>
						</v-list-item>
					</v-list>
				</v-menu>
			</div>
			<p v-show="query.section_id && entities.length <= 0" class="text-center my-4">
				No hay Sesiones
			</p>
		</div>
		<brain-dialog v-model="dlg_create" @submit="add" :loading="ldg_save">
			<template #body>
				<div class="close-modal">
					<h3>Nueva Sesión</h3>
					<v-btn class="mx-2" icon small @click="close()">
						<v-icon> mdi-close-thick </v-icon>
					</v-btn>
				</div>
				<v-select
					v-model="entity.course_id"
					:items="courses"
					item-text="name"
					item-value="_id"
					label="Curso"
					class="mt-4"
				></v-select>
				<TeacherChooser :value="value" @choose="chooseTeacher"></TeacherChooser>
			</template>
			<template #actions>
				<m-btn type="submit" :loading="ldg_save" color="primary" small>Guardar</m-btn>
			</template>
		</brain-dialog>
		<brain-dialog v-model="dlg_edit" @submit="update" :loading="ldg_save">
			<template #body>
				<div class="close-modal">
					<h3>Asignar Docente</h3>
					<v-btn class="mx-2" icon small @click="close()">
						<v-icon> mdi-close-thick </v-icon>
					</v-btn>
				</div>
				<p class="mt-4">
					<strong>{{ (courses.find((c) => c._id === entity.course_id) || {}).name }}</strong>
				</p>
				<TeacherChooser :value="value" @choose="chooseTeacher"></TeacherChooser>
			</template>
			<template #actions>
				<m-btn type="submit" :loading="ldg_save" color="primary" small>Guardar</m-btn>
			</template>
		</brain-dialog>
	</div>
</template>

<script>
import SessionFilter from '@/components/globals/Session/Filter';
import TeacherChooser from '@/components/globals/Teacher/Choose';
import BrainDialog from './BrainDialog';
import { getCourses } from "@/services/courseService";

export default {
	components: {SessionFilter, BrainDialog, TeacherChooser},
	data: () => ({
		entities: [],
		entity: {},
		value: 0,
		courses: [],
		teachers: [],
		dlg_create: false,
		dlg_edit: false,
		ldg_save: false,
		query: {},
	}),
	methods: {
		chooseTeacher(teacher) {
			this.entity.teacher = teacher;
			this.entity.teacher_id = teacher._id;
		},
		close() {
      this.dlg_create = false;
      this.dlg_edit = false;
			this.entity = {};
			this.value = 1;
		},
		async filter(query) {
			this.query = query;
			if (query['section_id']) {
				this.loadSessions(query)
        this.loadCourses(query.grade_id)
			} else {
				this.entities = [];
			}
    },
    async loadCourses(grade_id) {
      this.showLoading("Cargando Cursos");
      try {
        this.courses = await getCourses(grade_id);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async loadSessions(query) {
      this.showLoading("Cargando Sesiones");
        try {
          this.entities = this.mongoArr(await this.$api.session.getAll(query));
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
      this.hideLoading();
    },
		async add() {
			this.ldg_save = true;
			try {
				let {_id} = await this.$api.session.add(this.entity);
				this.entity._id = _id;
				this.entity.course = this.courses.find((c) => c._id === this.entity.course_id);
				this.entities.push(this.entity);
				this.close();
			} catch (error) {
				this.showMessage('', error.msg || error);
			}
			this.ldg_save = false;
		},
		async update() {
			this.ldg_save = true;
			try {
				await this.$api.session.update(this.entity._id, this.entity);
				let idx = this.entities.findIndex((e) => e._id === this.entity._id);
				this.entities[idx] = JSON.parse(JSON.stringify(this.entity));
				this.entities.splice(); // updates the array without modifying it
				this.close();
			} catch (error) {
				this.showMessage('', error.msg || error);
			}
			this.ldg_save = false;
		},
		async remove() {
			this.showLoading('Eliminando');
			try {
				await this.$api.session.remove(this.entity._id);
				this.entities = this.entities.filter((e) => e._id !== this.entity._id);
			} catch (error) {
				this.showMessage('', error.msg || error);
			}
			this.hideLoading();
		},
		//
		async showCreate() {
			this.entity = Object.assign({}, this.query);
			this.dlg_create = true;
		},
		async showEdit(e) {
			this.entity = Object.assign({}, e);
			this.dlg_edit = true;
		},
		async showRemove(e) {
			this.entity = e;
			this.$confirm(
				{
					callback: (confirm) => {
						if (confirm) {
							this.remove();
						}
					},
					message: `
           <p class="mt-4">
            La sesión no debe tener evaluaciones ni tareas asignadas para
            continuar con la eliminación.
          </p>
          <p>Los eventos creados dentro de la sesión serán eliminados.</p>
          `,
				},
				'delete',
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.editor {
	&__title {
		display: flex;
		align-items: center;
	}
	&__menu {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
	}
}

.session {
	overflow: hidden;
	background: rgba(0, 0, 0, 0.05);
	border-radius: 12px;
	user-select: none;
	display: flex;
	align-items: center;

	&__body {
		padding: 18px 24px;
		flex-grow: 1;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		column-gap: 20px;
	}
}

.close-modal {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.cancel-button {
	background: none;
	border: 1px solid gray;
	margin-right: 8px;
}
</style>
