<template>
  <!-- TODO: Metacognition Limit 5 lines -->
  <!-- TODO: Metacognition Show Questions -->
  <div>
    <div v-if="material && report" class="report mb-4">
      <div v-if="!readonly" class="report__menu">
        <m-btn @click="dlg_remove = true" color="dark" small class="mr-2"
          >Limpiar</m-btn
        >
        <m-btn @click="save()" color="primary" small>Guardar</m-btn>
      </div>

      <div class="report__time my-4 mx-2">
        <strong>Título de la Unidad:</strong>
        <span>{{ material.name }}</span>

        <strong>Curso:</strong>
        <span v-if="course">{{ course.name }}</span>
        <span v-else>...</span>

        <strong :class="{ 'mt-1': !readonly }">Temporización:</strong>
        <v-text-field
          v-if="!readonly"
          v-model="report.time"
          :maxlength="ReportModel.time.max_length"
          placeholder="Escriba aquí"
          dense
          hide-details
        ></v-text-field>
        <span v-else>{{ report.time }}</span>

        <strong>Fecha:</strong>
        <input
          type="datetime-local"
          v-model="report.time_start_f"
          :readonly="readonly"
        />

        <strong>Grados y Secciones:</strong>
        <div v-if="sessions.length > 0">
          <p v-for="(s, idx) in sessions" :key="idx" class="mb-1">
            {{ `${s.grade.name} - ${s.section.name}` }}
          </p>
        </div>
        <span v-else>...</span>

        <strong>Docente:</strong>
        <span v-if="course && course.teacher">{{
          `${course.teacher.last_name}, ${course.teacher.first_name}`
        }}</span>
        <span v-else>...</span>
      </div>

      <div class="phase">
        <div
          @click="
            show_phase.motivation = !show_phase.motivation;
            $forceUpdate();
          "
          class="phase__menu"
        >
          <h2 class="phase__title">Motivación / Introducción</h2>
          <v-icon
            class="phase__icon"
            :class="{ 'phase__icon--active': show_phase.motivation }"
            >mdi-chevron-down</v-icon
          >
        </div>
        <div v-show="show_phase.motivation">
          <DocumentEditor
            ref="report-motivation"
            id="report-motivation"
            :data="report.motivation.document"
            :document_type="'course'"
            :document_id="material.course_id"
            hideControls
            :readonly="readonly"
            class="phase__document"
          />
          <div class="phase__content mx-3">
            <div class="mb-2"><strong>Incluye:</strong></div>
            <label v-for="(c, idx) in content_type" :key="idx" class="mr-4">
              <input
                type="checkbox"
                :value="c.value"
                v-model="report.motivation.content"
                :disabled="readonly"
              />
              <span class="ml-1">{{ c.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="phase">
        <div
          @click="
            show_phase.construction = !show_phase.construction;
            $forceUpdate();
          "
          class="phase__menu"
        >
          <h2 class="phase__title">Construcción</h2>
          <v-icon
            class="phase__icon"
            :class="{ 'phase__icon--active': show_phase.construction }"
            >mdi-chevron-down</v-icon
          >
        </div>
        <div v-show="show_phase.construction">
          <DocumentEditor
            ref="report-construction"
            id="report-construction"
            :data="report.construction.document"
            :document_type="'course'"
            :document_id="material.course_id"
            :readonly="readonly"
            hideControls
            class="phase__document"
          />
          <div class="phase__content mx-3">
            <div class="mb-2"><strong>Incluye:</strong></div>
            <label v-for="(c, idx) in content_type_2" :key="idx" class="mr-4">
              <input
                type="checkbox"
                :value="c.value"
                v-model="report.construction.content"
                :disabled="readonly"
              />
              <span class="ml-1">{{ c.name }}</span>
            </label>
          </div>

          <div v-if="show_material" class="m-card mt-3">
            <div class="m-card__body">
              <h3 class="mb-2">Preguntas Frecuentes</h3>
              <div v-for="(f, idx) in material.data_fs['faq']" :key="idx">
                <strong>{{ f.question }}</strong>
                <p>{{ f.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="phase">
        <div
          @click="
            show_phase.metacognition = !show_phase.metacognition;
            $forceUpdate();
          "
          class="phase__menu"
        >
          <h2 class="phase__title">Metacognición</h2>
          <v-icon
            class="phase__icon"
            :class="{ 'phase__icon--active': show_phase.metacognition }"
            >mdi-chevron-down</v-icon
          >
        </div>
        <div v-show="show_phase.metacognition">
          <DocumentEditor
            ref="report-metacognition"
            id="report-metacognition"
            :data="report.metacognition.document"
            :document_type="'course'"
            :document_id="material.course_id"
            :readonly="readonly"
            hideControls
            class="phase__document"
          />
        </div>
      </div>

      <div class="phase">
        <div
          @click="
            show_phase.transference = !show_phase.transference;
            $forceUpdate();
          "
          class="phase__menu"
        >
          <h2 class="phase__title">Transferencia</h2>
          <v-icon
            class="phase__icon"
            :class="{ 'phase__icon--active': show_phase.transference }"
            >mdi-chevron-down</v-icon
          >
        </div>
        <div v-show="show_phase.transference">
          <DocumentEditor
            ref="report-transference"
            id="report-transference"
            :data="report.transference.document"
            :document_type="'course'"
            :document_id="material.course_id"
            :readonly="readonly"
            hideControls
            class="phase__document"
          />
          <div class="phase__content mx-3">
            <div class="mb-2"><strong>Incluye:</strong></div>
            <label v-for="(c, idx) in content_type_4" :key="idx" class="mr-4">
              <input
                type="checkbox"
                :value="c.value"
                v-model="report.transference.content"
                :disabled="readonly"
              />
              <span class="ml-1">{{ c.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="phase">
        <hr
          class="mt-10 mb-10"
          style="border: none; border-bottom: 1px solid #ccc"
        />
        <div
          @click="
            show_phase.observations = !show_phase.observations;
            $forceUpdate();
          "
          class="phase__menu"
        >
          <h2 class="phase__title">Observaciones</h2>
          <v-icon
            class="phase__icon"
            :class="{ 'phase__icon--active': show_phase.observations }"
            >mdi-chevron-down</v-icon
          >
        </div>
        <div v-show="show_phase.observations">
          <DocumentEditor
            ref="report-observations"
            id="report-observations"
            :data="report.observations.document"
            :document_type="'course'"
            :document_id="material.course_id"
            :readonly="readonly"
            hideControls
            class="phase__document"
          />
        </div>
      </div>

      <!-- DIALOG REMOVE -->
      <v-dialog v-model="dlg_remove" max-width="400">
        <div class="m-card">
          <div class="m-card__body">
            <h3>¿Desea limpiar?</h3>
            <p class="mt-4">No podrá revertir los cambios.</p>
          </div>
          <div class="m-card__actions">
            <m-btn
              @click="dlg_remove = false"
              color="primary"
              small
              class="mr-2"
              >Cancelar</m-btn
            >
            <m-btn
              @click="
                reset();
                dlg_remove = false;
              "
              color="dark"
              small
              >Continuar</m-btn
            >
          </div>
        </div>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

import ReportModel from "@/models/Report";

export default {
  props: {
    material_id: String,
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    material: null,
    report: null,
    course: null,
    sessions: [],
    //
    // show_material: true,
    show_material: false,
    show_phase: {},
    content_type: [
      {
        name: "Imágenes",
        value: "image",
      },
      {
        name: "Videos",
        value: "video",
      },
      {
        name: "Resumen",
        value: "overview",
      },
    ],
    content_type_2: [
      {
        name: "Imágenes",
        value: "image",
      },
      {
        name: "Videos",
        value: "video",
      },
      {
        name: "Ejercicios",
        value: "exercise",
      },
      {
        name: "Ejemplos",
        value: "example",
      },
      {
        name: "Enlaces",
        value: "hyperlinks",
      },
    ],
    content_type_4: [
      {
        name: "Imágenes",
        value: "image",
      },
      {
        name: "Videos",
        value: "video",
      },
      {
        name: "Ejercicios",
        value: "exercise",
      },
      {
        name: "Ejemplos",
        value: "example",
      },
      {
        name: "Enlaces",
        value: "hyperlinks",
      },
    ],
    dlg_remove: false,
    ReportModel,
  }),
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Reporte");
      try {
        let [material, report] = await Promise.all([
          this.$api.material.get(this.material_id),
          this.$api.report.get(this.material_id),
        ]);

        this.material = this.mongo(material);
        report = this.mongo(report) || {};

        //
        report.time_start_f = this.dateToInput(
          report.time_start ? report.time_start : new Date()
        );
        let document_default = JSON.stringify({
          blocks: [{ type: "paragraph", data: { text: "Escriba aquí" } }],
        });

        report.motivation = report.motivation
          ? report.motivation
          : {
              document: document_default,
              content: [],
            };
        report.construction = report.construction
          ? report.construction
          : {
              document: document_default,
              content: [],
            };
        report.metacognition = report.metacognition
          ? report.metacognition
          : {
              document: document_default,
              content: [],
            };
        report.transference = report.transference
          ? report.transference
          : {
              document: document_default,
              content: [],
            };
        report.observations = report.observations
          ? report.observations
          : {
              document: document_default,
              content: [],
            };

        this.report = report;
      } catch (error) {
        this.showMessage("", error.msg || "Ha ocurrido un error");
      }
      this.hideLoading();

      this.course = this.mongo(
        await this.$api.course.get(this.material.course_id)
      );
      this.sessions = this.mongoArr(
        await this.$api.session.getAll({
          course_id: this.material.course_id,
        })
      );
    },
    async save() {
      this.showLoading("Guardando Cambios");

      let {
        time,
        time_start_f,
        motivation,
        construction,
        metacognition,
        transference,
        observations,
      } = this.report;
      let time_start = new Date(time_start_f);

      try {
        await this.$api.report.update({
          material_id: this.material_id,
          time,
          time_start,
          motivation: {
            document: await this.$refs["report-motivation"].getData(),
            content: motivation.content,
          },
          construction: {
            document: await this.$refs["report-construction"].getData(),
            content: construction.content,
          },
          metacognition: {
            document: await this.$refs["report-metacognition"].getData(),
            content: metacognition.content,
          },
          transference: {
            document: await this.$refs["report-transference"].getData(),
            content: transference.content,
          },
          observations: {
            document: await this.$refs["report-observations"].getData(),
            content: observations.content,
          },
        });
      } catch (error) {
        this.showMessage("", error.msg || error);
      }

      this.hideLoading();
    },
    async reset() {
      this.report = {
        time: "",
        time_start_f: this.dateToInput(new Date()),
        motivation: {
          document: "",
          content: [],
        },
        construction: {
          document: "",
          content: [],
        },
        metacognition: {
          document: "",
          content: [],
        },
        transference: {
          document: "",
          content: [],
        },
        observations: {
          document: "",
          content: [],
        },
      };
      this.$refs["report-motivation"].clear();
      this.$refs["report-construction"].clear();
      this.$refs["report-metacognition"].clear();
      this.$refs["report-transference"].clear();
      this.$refs["report-observations"].clear();
      await this.save();
    },
  },
  components: {
    DocumentEditor,
  },
};
</script>

<style lang='scss' scoped>
.report {
  max-width: 800px;
  margin: 0 auto;

  &__menu {
    display: flex;
    justify-content: flex-end;
  }

  &__time {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
    row-gap: 8px;
  }
}

.phase {
  margin-top: 24px;

  &__menu {
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.03);
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  &__icon {
    &--active {
      transform: rotate(180deg);
    }
  }
  &__title {
    font-size: 1.3rem;
  }
  &__document {
    margin-top: 16px;
    background: #fff;
    padding: 30px 20px;
    box-shadow: 0 2px 10px #ccc;
    border-radius: 6px;
  }
  &__content {
    margin-top: 16px;
  }
}
</style>