<template>
  <div>
    <v-textarea
      v-model="answer.text"
      placeholder="Escribe tu respuesta"
      dense
      hide-details
    ></v-textarea>
    <div class="mt-4">
      <input
        id="ipt_file"
        type="file"
        onclick="this.value = null"
        @change="onFileSelected($event)"
        style="display: none"
      />
      <m-btn onclick="ipt_file.click()" color="primary" small text
        >Subir Archivo</m-btn
      >
    </div>
    <a v-for="(file, f_idx) in answer.files" :key="f_idx" class="file mt-2">
      <a :href="file.url" target="_blank" class="file__body">
        <div class="file__type">
          <img
            v-if="getType(file) === 'audio'"
            src="@/assets/file/icon-audio.svg"
          />
          <img
            v-else-if="getType(file) === 'image'"
            src="@/assets/file/icon-image.svg"
          />
          <img
            v-else-if="getType(file) === 'video'"
            src="@/assets/file/icon-video.svg"
          />
          <!--  -->
          <img
            v-else-if="file.content_type === 'application/pdf'"
            src="@/assets/file/icon-application-pdf.svg"
          />
          <img v-else src="@/assets/file/icon-default.svg" />
        </div>
        <span class="file__name">{{ getName(file) }}</span>
      </a>
      <div class="file__actions mx-2">
        <v-btn @click="showRemove(file)" icon>
          <v-icon style="font-size: 1.5rem">mdi-delete</v-icon>
        </v-btn>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    evaluationId: null,
    value: {},
  },
  data() {
    return {
      answer: this.value,
    };
  },
  watch: {
    answer() {
      this.handleChange();
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.answer);
    },
    getName(file) {
      return file.name.substring(file.name.lastIndexOf("/") + 1);
    },
    getType(file) {
      return file.content_type.split("/")[0];
    },
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      var formData = new FormData();
      formData.append("file", file);

      this.showLoading("Subiendo Archivo");
      try {
        let new_file = await this.$api.evaluation.addFile(
          this.evaluationId,
          formData
        );
        this.answer.files.push(new_file);
      } catch (error) {
        this.showMessage(
          "",
          error.msg || "Ha ocurrido un error al subir el archivo."
        );
      }
      this.hideLoading();
    },
  },
};
</script>

<style></style>
