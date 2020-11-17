<template>
  <div class="report">
    <div class="report__menu mb-4">
      <m-btn @click="$emit('unselect')" color="dark" text small>
        <v-icon style="font-size: 1.2rem" class="mr-2">mdi-close</v-icon>
        <span>Cerrar</span>
      </m-btn>
    </div>

    <div class="report__time mb-5 mx-3">
      <strong>Título de la Unidad:</strong>
      <span>{{ report.material.name }}</span>
      <strong>Temporización:</strong>
      <span>{{ report.time }}</span>
      <strong>Fecha:</strong>
      <span>{{ report.time_start_f }} </span>
    </div>

    <div class="phase mb-5">
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
          hideControls
          readonly
          class="phase__document"
        />
        <div class="phase__content mx-3">
          <strong class="mr-2">Incluye:</strong>
          <span>{{
            report.motivation.content.map((c) => content_type[c]).join(", ")
          }}</span>
        </div>
      </div>
    </div>

    <div class="phase mb-5">
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
          readonly
          hideControls
          class="phase__document"
        />
        <div class="phase__content mx-3">
          <strong class="mr-2">Incluye:</strong>
          <span>{{
            report.construction.content.map((c) => content_type[c]).join(", ")
          }}</span>
        </div>
      </div>
    </div>

    <div class="phase mb-5">
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
          readonly
          hideControls
          class="phase__document"
        />
      </div>
    </div>

    <div class="phase mb-5">
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
          readonly
          hideControls
          class="phase__document"
        />
        <div class="phase__content mx-3">
          <strong class="mr-2">Incluye:</strong>
          <span>{{
            report.transference.content.map((c) => content_type[c]).join(", ")
          }}</span>
        </div>
      </div>
    </div>

    <div class="phase mb-5">
      <hr class="mt-10 mb-10" />
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
          readonly
          hideControls
          class="phase__document"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DocumentEditor from "@/components/globals/DocumentEditor";

export default {
  props: {
    report: Object,
  },
  data: () => ({
    show_phase: {},
    content_type: {
      image: "Imágenes",
      video: "Videos",
      exercise: "Ejercicios",
      example: "Ejemplos",
      value: "example",
      hyperlinks: "Enlaces",
      overview: "Resumen",
    },
  }),
  created() {
    this.report.time_start_f = this.report.time_start
      ? this.formatDateTime(this.report.time_start)
      : "No hay fecha";
  },
  components: {
    DocumentEditor,
  },
};
</script>

<style lang='scss' scoped>
.report {
  width: 100%;
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