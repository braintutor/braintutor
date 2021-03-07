<template>
  <div>
    <div v-if="isReadonly">
      <div
        v-for="(alternative, a_idx) in question.alternatives"
        :key="a_idx"
        class="alternative mt-3"
      >
        <span
          class="alternative__checkbox mr-3"
          :class="{
            'alternative__checkbox--active': a_idx === answer.alternative,
          }"
        ></span>
        <span
          class="alternative__text"
          :class="{
            'alternative__text--correct': a_idx === question.correct,
            'alternative__text--incorrect':
              a_idx !== question.correct && a_idx === answer.alternative,
          }"
          >{{ alternative }}</span
        >
      </div>
    </div>
    <div v-else>
      <v-radio-group v-model="answer.alternative">
        <v-radio
          class="question__alternative"
          v-for="(alternative, a_idx) in question.alternatives"
          :key="a_idx"
          :label="alternative"
          :value="a_idx"
        ></v-radio>
        <label
          class="m-btn m-btn--dark m-btn--text m-btn--small mt-3 mx-auto"
          style="width: max-content"
          :for="id+ ''"
         
        >
          Limpiar
        </label>
        <v-radio v-show="false" :value="-1" :id="id+ ''"  ></v-radio>
      </v-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      default: () => 0,
    },
    evaluationId: null,
    value: {},
    isReadonly: {
      type: Boolean,
      default: () => false,
    },
    question: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      answer: this.value,
    };
  },
  watch: {
    value: {
      handler: function(value) {
        this.answer = value;
      },
      immediate: true,
    },
    answer: {
      handler: function() {
        this.handleChange();
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectionFile(file) {
      this.$emit("selectedFile", file);
    },
    handleChange() {
      this.$emit("input", this.answer);
    },
  },
};
</script>

<style lang="scss" scoped>
.alternative {
  display: flex;
  align-items: center;
  &__checkbox {
    position: relative;
    flex-shrink: 0;
    display: block;
    width: 18px;
    height: 18px;
    border: 1px solid var(--color-active);
    border-radius: 50%;

    &--active:before {
      content: " ";
      position: absolute;
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
      background: var(--color-active);
      border-radius: 50%;
    }
  }
  &__text {
    flex-grow: 1;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.025);
    border-radius: 6px;
    white-space: pre-line;
    &:last-child {
      margin-bottom: 0;
    }
    &--correct {
      background: rgba(17, 192, 70, 0.2);
      color: rgb(17, 192, 69);
    }
    &--incorrect {
      background: rgba(197, 47, 47, 0.2);
      color: rgb(197, 47, 47);
    }
  }
}
</style>
