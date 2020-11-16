<template>
  <div v-if="material && report" class="report mb-4">
    <div class="report__menu">
      <m-btn @click="reset()" color="dark" small class="mr-2">Limpiar</m-btn>
      <m-btn @click="save()" color="primary" small>Guardar</m-btn>
    </div>

    <div class="report__time my-4 mx-2">
      <strong>Título de la Unidad:</strong>
      <span>{{ material.name }}</span>
      <strong class="mt-1">Temporización:</strong>
      <v-text-field
        v-model="report.time"
        :maxlength="ReportModel.time.max_length"
        dense
        hide-details
      ></v-text-field>
      <strong>Fecha:</strong>
      <input type="datetime-local" v-model="report.time_start_f" />
      <strong>Grado y Sección:</strong>
      <span v-if="sessions.length > 0">{{
        sessions.map((s) => s.classroom.name).join(", ")
      }}</span>
      <span v-else>...</span>
      <strong>Docente:</strong>
      <span v-if="teacher">{{
        `${teacher.last_name}, ${teacher.first_name}`
      }}</span>
      <span v-else>...</span>
    </div>

    <div class="phase">
      <h2 class="phase__title mx-2">Motivación / Introducción</h2>
      <DocumentEditor
        ref="report-motivation"
        id="report-motivation"
        :data="report.motivation.document"
        :document_type="'course'"
        :document_id="material.course_id"
        hideControls
        class="phase__document"
      />
      <div class="phase__content mx-2">
        <div class="mb-2"><strong>Incluye:</strong></div>
        <label v-for="(c, idx) in content_type" :key="idx" class="mr-4">
          <input
            type="checkbox"
            :value="c.value"
            v-model="report.motivation.content"
          />
          <span class="ml-1">{{ c.name }}</span>
        </label>
      </div>
    </div>

    <!-- TODO: Desplegar -->
    <!-- TODO: Limpiar -->
    <div class="phase">
      <h2 class="phase__title mx-2">Construcción</h2>
      <DocumentEditor
        ref="report-construction"
        id="report-construction"
        :data="report.construction.document"
        :document_type="'course'"
        :document_id="material.course_id"
        hideControls
        class="phase__document"
      />
      <div class="phase__content mx-2">
        <div class="mb-2"><strong>Incluye:</strong></div>
        <label v-for="(c, idx) in content_type_2" :key="idx" class="mr-4">
          <input
            type="checkbox"
            :value="c.value"
            v-model="report.construction.content"
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

    <div class="phase">
      <h2 class="phase__title mx-2">Metacognición</h2>
      <DocumentEditor
        ref="report-metacognition"
        id="report-metacognition"
        :data="report.metacognition.document"
        :document_type="'course'"
        :document_id="material.course_id"
        hideControls
        class="phase__document"
      />
    </div>

    <div class="phase">
      <h2 class="phase__title mx-2">Transferencia</h2>
      <DocumentEditor
        ref="report-transference"
        id="report-transference"
        :data="report.transference.document"
        :document_type="'course'"
        :document_id="material.course_id"
        hideControls
        class="phase__document"
      />
      <DocumentEditor
        v-if="show_material"
        :id="'hyperlinks'"
        :data="material.data_fs['hyperlinks']"
        hideControls
        readonly
      />
      <div class="phase__content mx-2">
        <div class="mb-2"><strong>Incluye:</strong></div>
        <label v-for="(c, idx) in content_type_4" :key="idx" class="mr-4">
          <input
            type="checkbox"
            :value="c.value"
            v-model="report.motivation.content"
          />
          <span class="ml-1">{{ c.name }}</span>
        </label>
      </div>
    </div>

    <div class="phase">
      <hr class="mt-10 mb-10" />
      <h2 class="phase__title mx-2">Observaciones</h2>
      <DocumentEditor
        ref="report-observations"
        id="report-observations"
        :data="report.observations.document"
        :document_type="'course'"
        :document_id="material.course_id"
        hideControls
        class="phase__document"
      />
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

import ReportModel from "@/models/Report";

export default {
  data: () => ({
    material: null,
    report: null,
    teacher: null,
    sessions: [],
    //
    // show_material: true,
    show_material: false,
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
    ReportModel,
  }),
  async created() {
    this.showLoading("Cargando Reporte");
    let material_id = this.$route.params["material_id"];

    try {
      let [material, report] = await Promise.all([
        this.$api.material.get(material_id),
        this.$api.report.get(material_id),
      ]);

      this.material = this.mongo(material);
      report = this.mongo(report) || {};

      report.time_start_f = this.dateToInput(
        report.time_start ? report.time_start : new Date()
      );
      report.motivation = report.motivation
        ? report.motivation
        : {
            document: "",
            content: [],
          };
      report.construction = report.construction
        ? report.construction
        : {
            document: "",
            content: [],
          };
      report.metacognition = report.metacognition
        ? report.metacognition
        : {
            document: "",
            content: [],
          };
      report.transference = report.transference
        ? report.transference
        : {
            document: "",
            content: [],
          };
      report.observations = report.observations
        ? report.observations
        : {
            document: "",
            content: [],
          };

      this.report = report;
    } catch (error) {
      this.showMessage("", error.msg || "Ha ocurrido un error");
    }
    this.hideLoading();

    let course = this.mongo(
      await this.$api.course.get(this.material.course_id)
    );
    this.sessions = this.mongoArr(
      await this.$api.session.getAll({
        course_id: this.material.course_id,
      })
    );
    this.teacher = course.teacher;
  },
  methods: {
    async save() {
      this.showLoading("Guardando Cambios");

      let material_id = this.$route.params["material_id"];
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
          material_id,
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
  margin-top: 30px;

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