<template>
  <div class="files">
    <div class="files__menu mb-4">
      <m-btn
        @click="show = 'LIST'"
        :text="show !== 'LIST'"
        color="primary"
        small
        class="mr-2"
        >Mis Archivos</m-btn
      >
      <m-btn
        @click="show = 'UPLOAD'"
        :text="show !== 'UPLOAD'"
        color="dark"
        small
        >Subir Archivo</m-btn
      >
    </div>

    <div v-show="loading" style="width: max-content" class="pa-4 mx-auto">
      <v-progress-circular
        :width="3"
        :size="80"
        indeterminate
        color="var(--color-subtitle)"
      ></v-progress-circular>
    </div>

    <div v-show="!loading">
      <div v-show="show === 'LIST'">
        <p>{{ size }}</p>
        <p v-show="files.length <= 0" class="text-center my-3">
          No hay archivos.
        </p>

        <div class="container pa-0">
          <div class="row no-gutters">
            <div
              v-for="(file, idx) in files"
              :key="idx"
              @click="$emit('file', file)"
              class="file col-6 col-md-4"
            >
              <img :src="`${file.url}?${Date.now()}`" />
              <div class="file__menu">
                <span class="file__name pl-2">{{
                  file.name.substring(file.name.lastIndexOf("/") + 1)
                }}</span>
                <v-btn @click.stop="showRemove(file)" color="error" icon small>
                  <v-icon style="font-size: 1.4rem">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="show === 'UPLOAD'">
        <input
          v-show="!loading"
          type="file"
          onclick="value = null"
          @change="onFileSelected"
        />
      </div>
    </div>

    <!-- DLG REMOVE -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <h3>Confirmar eliminación</h3>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" color="primary" small class="mr-2"
            >Cancelar</m-btn
          >
          <m-btn
            @click="
              dlg_remove = false;
              removeFile();
            "
            color="error"
            small
            >Eliminar</m-btn
          >
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import variables from "@/models/variables";

export default {
  data: () => ({
    session_id: "",
    files: [],
    file_selected: null,
    //
    show: "LIST",
    loading: false,
    dlg_remove: false,
    variables,
  }),
  computed: {
    size() {
      let current_size = this.files.reduce((sum, f) => {
        sum += f.size;
        return sum;
      }, 0);
      let kb_to_mb = (size) => (size / 1000 / 1000).toFixed(3);
      return `Espacio utilizado: ${kb_to_mb(current_size)} MB / ${kb_to_mb(
        this.variables.max_session_size
      )} MB`;
    },
  },
  async created() {
    this.session_id = this.$router.currentRoute.params["session_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        let { files } = await this.$api.file.session.getFiles(this.session_id);
        this.files = files;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading = false;
    },
    async removeFile() {
      this.loading = true;
      let file_name = this.file_selected.name;
      let file_name_f = file_name.replaceAll("/", "&&");
      try {
        await this.$api.file.session.removeFile(this.session_id, file_name_f);
        this.files = this.files.filter((f) => f.name !== file_name);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading = false;
    },
    async showRemove(file) {
      this.file_selected = file;
      this.dlg_remove = true;
    },
    // Upload
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      this.loading = true;
      var formData = new FormData();
      formData.append("file", file);

      try {
        let { name, url, size } = await this.$api.file.session.addFile(
          this.session_id,
          formData
        );
        this.files.push({
          name,
          url,
          size,
        });
        this.show = "LIST";
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang='scss'>
.files {
  &__menu {
  }
}

.file {
  position: relative;
  transition: 0.3s;
  cursor: pointer;
  &:hover {
    box-shadow: 0 4px 8px #ccc;
  }
  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }
  &__menu {
    width: 100%;
    padding: 4px;

    position: absolute;
    left: 0;
    bottom: 0;
    background: #fff;

    display: flex;
    justify-content: space-between;
    align-items: center;

    opacity: 0;
    pointer-events: none;
    transition: 0.3s;

    .file:hover & {
      opacity: 1;
      pointer-events: initial;
    }
  }
  &__name {
    font-size: 0.85rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }
}
</style>