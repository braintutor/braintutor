<template>
  <div class="files m-container">
    <p v-if="files.length <= 0" class="text-center my-3">No hay archivos.</p>

    <div class="container pa-0">
      <div class="row no-gutters">
        <div
          v-for="(file, idx) in files"
          :key="idx"
          class="file col-6 col-md-4"
        >
          <img :src="`${file.url}?${Date.now()}`" />
          <div class="file__menu">
            <span class="file__name pl-2">{{
              file.name.substring(file.name.lastIndexOf("/") + 1)
            }}</span>
            <v-btn @click="showRemove(file)" color="error" icon small>
              <v-icon style="font-size: 1.4rem">mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
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
export default {
  data: () => ({
    session_id: "",
    files: [],
    file_selected: null,
    dlg_remove: false,
  }),
  async created() {
    this.session_id = this.$router.currentRoute.params["session_id"];
    this.showLoading("");
    try {
      let { files } = await this.$api.session.getFiles(this.session_id);
      this.files = files;
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();
  },
  methods: {
    async removeFile() {
      this.showLoading("Eliminando");
      let file_name = this.file_selected.name;
      let file_name_f = file_name.replaceAll("/", "&&");
      try {
        await this.$api.session.removeFile(this.session_id, file_name_f);
        this.files = this.files.filter((f) => f.name !== file_name);
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async showRemove(file) {
      this.file_selected = file;
      this.dlg_remove = true;
    },
  },
};
</script>

<style lang='scss'>
.files {
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