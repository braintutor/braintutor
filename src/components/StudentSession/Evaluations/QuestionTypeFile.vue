<template>
  <div>
    <div v-if="!isReadonly">
      <v-textarea
        v-model="answer.text"
        placeholder="Escribe tu respuesta"
        dense
        hide-details
      ></v-textarea>
      <div class="mt-4">
        <input
          id="ipt_file"
          ref="inputFile"
          type="file"
          onclick="this.value = null"
          @change="onFileSelected($event)"
          style="display: none"
        />
        <m-btn @click="$refs.inputFile.click()" color="primary" small text
          >Subir Archivo</m-btn
        >
      </div>
    </div>
    <div v-else>
      <h3>Respuesta:</h3>
      <p class="ma-0 mt-3">{{ answer.text }}</p>
    </div>

    <a v-for="(file, f_idx) in answer.files" :key="f_idx" class="file mt-2">
      <a class="file__body" @click="handleSelectionFile(file)">
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
      <div class="file__actions mx-2" v-if="!isReadonly">
        <v-btn @click="removeFile(file, f_idx)" icon>
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
    isReadonly: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      answer: this.value,
    };
  },
  watch: {
    answer: {
      handler: function() {
        console.log("aca", this.answer);
        this.handleChange();
        console.log("chane");
      },
      immediate: true,
    },
  },
  methods: {
    handleSelectionFile(file) {
      console.log("emit");
      this.$emit("selectedFile", file);
    },
    handleChange() {
      console.log(this.answer);
      this.$emit("input", this.answer);
    },
    getName(file) {
      return file.name.substring(file.name.lastIndexOf("/") + 1);
    },
    getType(file) {
      return file.content_type.split("/")[0];
    },
    async removeFile(file, idx) {
      this.showLoading("Eliminando Archivo");
      let file_name = file.name;
      let file_name_f = file_name.replaceAll("/", "&&");
      try {
        await this.$api.evaluation.removeFile(this.evaluationId, file_name_f);
        let { files } = this.answer
        files.splice(idx, 1);
        this.answer = { ...this.answer, files };
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      var formData = new FormData();
      formData.append("file", file);

      this.showLoading("Subiendo Archivo");
      let new_file;
      try {
        new_file = await this.$api.evaluation.addFile(
          this.evaluationId,
          formData
        );
      } catch (error) {
        this.showMessage(
          "",
          error.msg || "Ha ocurrido un error al subir el archivo."
        );
      } finally {
        let { files = [] } = this.answer;
        files.push(new_file);
        this.answer = { ...this.answer, files };
        this.handleChange();
      }
      this.hideLoading();
    },
  },
};
</script>

<style lang="scss" scoped>
.file {
  display: block;
  background: rgba(0, 0, 255, 0.07);
  border-radius: 6px;
  display: flex;
  align-items: center;

  &__body {
    overflow: hidden;
    flex-grow: 1;
    color: rgba(0, 0, 0, 0.75);
    text-decoration: none;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 255, 0.05);
    }
  }

  &__type {
    padding: 16px;
    opacity: 0.6;
    display: flex;
    align-items: center;

    img {
      height: 32px;
      width: 32px;
    }
  }
  &__name {
    flex-grow: 1;
    padding: 8px;
  }
}
</style>
