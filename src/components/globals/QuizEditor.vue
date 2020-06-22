<template>
  <section class="quiz">
    <!-- QUESTION -->
    <section v-for="(d, d_idx) in data" :key="d_idx" class="question m-card pa-3 mt-4">
      <v-textarea v-model="d.question" class="mb-3" rows="1" auto-grow dense hide-details></v-textarea>
      <!-- ALTERNATIVES -->
      <div class="alternatives">
        <!-- ALTERNATIVE -->
        <div v-for="(alternative, a_idx) in d.alternatives" :key="a_idx" class="alternative mt-2">
          <v-textarea
            v-model="d.alternatives[a_idx]"
            rows="1"
            :append-icon="d.alternatives.length > 2 ? 'mdi-close' : ''"
            @click:append="remove(d.alternatives, a_idx)"
            append.click
            auto-grow
            filled
            rounded
            dense
            hide-details
          ></v-textarea>
        </div>
        <div @click="addAlternative(d.alternatives)" class="alternative--add mt-2">+</div>
      </div>
    </section>
    <div @click="addQuestion(data)" class="quiz--add mt-4">+</div>
  </section>
</template>

<script>
export default {
  props: ["data"],
  methods: {
    addQuestion(arr) {
      arr.push({
        question: "Pregunta",
        alternatives: ["Alternativa 1", "Alternativa 2"]
      });
    },
    addAlternative(arr) {
      arr.push("Alternativa");
    },
    remove(arr, idx) {
      arr.splice(idx, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.quiz {
  &--add {
    padding: 20px;
    color: #ccc;
    font-size: 1.5rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 10px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
}

.question {
}

.alternatives {
}

.alternative {
  &--add {
    padding: 2px;
    color: #ccc;
    font-size: 1.5rem;
    text-align: center;
    border: 1px dashed #ccc;
    border-radius: 100px;
    transition: 0.2s;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }
  }
}
</style>