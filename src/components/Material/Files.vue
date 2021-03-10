<template>
  <div class="files">
    <div class="files__menu pa-3">
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
      <p class="ma-0 mt-3">{{ size }}</p>
    </div>
    <div class="files__body pb-3">
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
          <p v-show="files_f.length <= 0" class="text-center my-3">
            No hay archivos.
          </p>
          <v-container fluid class="pa-0">
            <v-row no-gutters>
              <v-col
                cols="6"
                md="4"
                v-for="(file, idx) in files_f"
                :key="idx"
                @click="$emit('file', file)"
                class="col-6 col-md-4 col-lg-3 pa-1"
              >
                <div class="m-file">
                  <div v-if="file.type === 'image'" class="m-file__content">
                    <img
                      v-if="file.type === 'image'"
                      :src="`${file.url}?${Date.now()}`"
                    />
                  </div>

                  <div v-else class="m-file__type">
                    <img
                      v-if="file.type === 'audio'"
                      src="@/assets/file/icon-audio.svg"
                    />
                    <img
                      v-else-if="file.type === 'image'"
                      src="@/assets/file/icon-image.svg"
                    />
                    <img
                      v-else-if="file.type === 'video'"
                      src="@/assets/file/icon-video.svg"
                    />
                    <!--  -->
                    <img
                      v-else-if="file.content_type === 'application/pdf'"
                      src="@/assets/file/icon-application-pdf.svg"
                    />
                    <img v-else src="@/assets/file/icon-default.svg" />
                  </div>
                  <div @click.stop="showFile(file)" class="m-file__menu">
                    <span class="m-file__name pl-2">{{ file.name_f }}</span>
                    <v-btn
                      @click.stop="showRemove(file)"
                      color="error"
                      icon
                      small
                    >
                      <v-icon style="font-size: 1.4rem">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div v-show="show === 'UPLOAD'" class="pa-4">
          <label for="ip-file" class="lab-file">Seleccionar archivo</label>
          <input
            v-show="!loading"
            type="file"
            onclick="value = null"
            @change="onFileSelected"
            id="ip-file"
            class="mx-3"
          />
        </div>
      </div>
    </div>
    <!-- DLG REMOVE -->
    <v-dialog v-model="dlg_remove" max-width="400">
      <div class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Confirmar eliminación</h3>
            <v-btn class="mx-2" icon small @click="dlg_remove = false">
              <v-icon dark>mdi-close-thick</v-icon>
            </v-btn>
          </div>
          <p class="mt-4">
            Si elimina este contenido, no podrá revertir los cambios.
          </p>
        </div>
        <div class="m-card__actions">
          <m-btn @click="dlg_remove = false" small class="cancel-button"
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
import { max_session_size, current_size } from "@/models/variables";

export default {
  props: {
    document_type: {
      type: String,
      required: true,
    },
    document_id: {
      type: String,
      required: true,
    },
    filters: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    files: [],
    file_selected: null,
    show: "LIST",
    loading: false,
    dlg_remove: false,
  }),
  computed: {
    size() {
      return `Espacio utilizado: ${current_size(
        this.files
      )} / ${max_session_size}`;
    },
    files_f() {
      return this.files
        .filter((f) => !f.name.includes("/task/"))
        .map((f) => ({
          ...f,
          name_f: f.name.substring(f.name.lastIndexOf("/") + 1),
          type: f.content_type.split("/")[0],
        }))
        .filter(
          (f) => this.filters.length <= 0 || this.filters.includes(f.type)
        );
    },
  },
  async created() {
    await this.init();
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        let { files } = await this.$api.file.getFiles(
          this.document_type,
          this.document_id
        );
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
        await this.$api.file.removeFile(
          this.document_type,
          this.document_id,
          file_name_f
        );
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
    showFile(file) {
      window.open(file.url, "_blank");
    },
    // Upload
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      this.loading = true;
      var formData = new FormData();
      formData.append("file", file);

      try {
        let file = await this.$api.file.addFile(
          this.document_type,
          this.document_id,
          formData
        );
        this.files.push(file);
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
  height: 100%;
  display: flex;
  flex-direction: column;

  &__body {
    flex-grow: 1;
    overflow-y: auto;
  }
}

$background-file: rgba(0, 0, 255, 0.05);

.m-file {
  position: relative;
  overflow: hidden;
  height: 100%;
  border-radius: 6px;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 4px 8px #ccc;
    z-index: 1;
  }
  &__type {
    height: 100%;
    padding: 40px;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: $background-file;
    }

    img {
      height: 36px;
      width: 36px;
    }
  }
  &__content {
    height: 100%;
    background: $background-file;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      display: block;
      max-width: 100%;
    }
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

    .m-file:hover & {
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

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lab-file {
 cursor:pointer;
 background: #DADADA;
 padding: 10px;
 border-radius: 10px;
 color: #000;
}

#ip-file {
  opacity:0;
  position: absolute;
  z-index: -1;
}
</style>