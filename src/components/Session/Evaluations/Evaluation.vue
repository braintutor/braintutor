<template>
  <div>
    <loading :active="loading" :message="loading_message" />
    <!-- Evaluation Content -->
    <div class="evaluation m-card">
      <div class="time">
        <p>Faltan {{time.m}} minuto(s) y {{time.s}} segundo(s)</p>
      </div>
      <div class="question" v-for="(c, c_idx) in evaluation.content" :key="c_idx">
        <p class="question__statement">{{`${c_idx + 1}. ${c.question}`}}</p>
        <v-radio-group v-model="c.answer">
          <v-radio
            class="question__alternative"
            v-for="(alternative, a_idx) in c.alternatives"
            :key="a_idx"
            :label="alternative"
            :value="a_idx"
          ></v-radio>
        </v-radio-group>
      </div>
      <div class="evaluation__action">
        <v-btn color="primary" @click="save()">Guardar</v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { setResult } from "@/services/evaluationService";
import { createTimer } from "@/services/timer";

export default {
  props: ["evaluation", "getEvaluations", "unselect", "showResult"],
  data: () => ({
    time_remaining: 0,
    time_total: 0,
    //
    loading: false,
    loading_message: ""
  }),
  computed: {
    time() {
      return {
        m: Math.floor(this.time_remaining / 60),
        s: this.time_remaining % 60
      };
    }
  },
  mounted() {
    this.time_total = this.evaluation.time * 60;
    this.time_remaining = this.time_total;
    // Timer
    this.clearTimer();
    let timer = createTimer(
      this.time_total,
      () => this.time_remaining--,
      () => this.save()
    );
    this.$store.commit("setTimer", timer);
  },
  methods: {
    async save() {
      this.clearTimer();
      this.loading = true;
      this.loading_message = "Guardando Puntaje";
      let evaluation_id = this.evaluation._id.$oid;
      let answer = this.evaluation.content.map(c => c.answer);
      let result = await setResult(evaluation_id, answer);
      this.unselect();
      await this.getEvaluations();
      this.showResult(result);
      this.loading = false;
    },
    //
    clearTimer() {
      this.$store.commit("clearTimer");
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.time {
  color: #acacac;
  text-align: center;
  font-size: 0.9rem;
  font-weight: bold;
}
.evaluation {
  padding: 18px;
  padding-bottom: 24px;
  &__action {
    display: flex;
    justify-content: center;
  }
}
.question {
  padding-bottom: 16px;
  &__statement {
    margin: 8px;
    font-weight: bold;
  }
  &__alternative {
    margin-bottom: 8px;
    padding: 8px 10px;
    background: #f5f5f5;
    border-radius: 10px;
    transition: background-color 0.2s;
    cursor: pointer;
    &:hover {
      background: #e6ecff;
    }
  }
}
</style>