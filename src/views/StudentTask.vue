<template>
  <div class="m-container pt-0">
    <div v-if="task">
      <div class="m-menu pa-0 pb-2">
        <div class="m-menu__left">
          <v-btn icon @click="redirectSession()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <span class="m-menu__title">Volver</span>
        </div>
      </div>

      <!-- TASK -->
      <TaskCard
        :time_start="task.time_start"
        :title="task.title"
        :description="task.description"
        disabled
      />

      <!-- ANSWER -->
      <div class="m-card mt-3">
        <div class="m-card__body">
          <div>
            {{ text }}
          </div>
          <input
            v-show="false"
            id="ipt_file"
            type="file"
            onclick="value = null"
            @change="onFileSelected"
          />
          <!-- FILES -->
          <div class="files">
            <div class="files__menu mb-4">
              <span>{{ size }}</span>
              <m-btn onclick="ipt_file.click()" color="primary" small
                >Subir Archivo</m-btn
              >
            </div>
            <!-- FILE -->
            <a v-for="(file, idx) in files_f" :key="idx" class="file mt-2">
              <a :href="file.url" target="_blank" class="file__body">
                <div class="file__type">
                  <img
                    v-if="file.type === 'audio'"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Speaker_Icon.svg/1024px-Speaker_Icon.svg.png"
                  />
                  <img
                    v-else-if="file.type === 'image'"
                    src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
                  />
                  <img
                    v-else
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR9NTAxbufxYBJOqHS9WvGyA8E-koSuV2YbBg&usqp=CAU"
                  />
                </div>
                <span class="file__name">{{ file.name_f }}</span>
              </a>
              <div class="file__actions mx-2">
                <v-btn @click="showRemove(file)" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </a>
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
            <m-btn
              @click="dlg_remove = false"
              color="primary"
              small
              class="mr-2"
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
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { getTaskByStudent } from "@/services/taskService";
import variables from "@/models/variables";

export default {
  data: () => ({
    task: null,
    text: {},
    files: [],
    file_selected: null,
    dlg_remove: false,
    //
    variables,
  }),
  computed: {
    files_f() {
      return this.files.map((f) => ({
        ...f,
        name_f: f.name.substring(f.name.lastIndexOf("/") + 1),
        type: f.content_type.split("/")[0],
      }));
    },
    size() {
      let current_size = this.files_f.reduce((sum, f) => {
        sum += f.size;
        return sum;
      }, 0);
      return `Espacio utilizado: ${this.kb_to_mb(
        current_size
      )} / ${this.kb_to_mb(this.variables.max_task_size)}`;
    },
  },
  async created() {
    this.task_id = this.$route.params["task_id"];
    await this.init();
  },
  methods: {
    async init() {
      this.showLoading("Cargando Tarea");
      try {
        this.task = this.mongo(await getTaskByStudent(this.task_id));
        let { text } = this.task.answer;
        this.text = text;
        // Files
        let { files } = await this.$api.file.getFilesTask(this.task_id);
        this.files = files;
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    // FILE
    async onFileSelected(e) {
      let file = e.target.files[0];
      if (!file) return;

      this.showLoading("Subiendo Archivo");
      var formData = new FormData();
      formData.append("file", file);

      try {
        let {
          name,
          url,
          size,
          content_type,
        } = await this.$api.file.addFileTask(this.task_id, formData);
        this.files.push({
          name,
          url,
          size,
          content_type,
        });
        this.show = "LIST";
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
    },
    async removeFile() {
      this.showLoading("Eliminando Archivo");
      let file_name = this.file_selected.name;
      let file_name_f = file_name.replaceAll("/", "&&");
      try {
        await this.$api.file.removeFileTask(this.task_id, file_name_f);
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
    kb_to_mb(size) {
      return `${(size / 1000 / 1000).toFixed(3)} MB`;
    },
    // ROUTE
    redirectSession() {
      this.$router
        .push(`/student-session/${this.task.session_id}/tasks`)
        .catch(() => {});
    },
  },
  components: {
    TaskCard,
  },
};
</script>

<style lang='scss' scoped>
.files {
  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(0, 0, 0, 0.6);
  }
}
.file {
  display: block;
  background: rgba(0, 0, 255, 0.07);
  border-radius: 6px;

  display: flex;
  align-items: center;

  &__body {
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
  &__actions {
  }

  &__type {
    padding: 16px;

    display: flex;
    align-items: center;

    img {
      height: 24px;
      width: 24px;
    }
  }
  &__name {
    flex-grow: 1;
    padding: 8px;
  }
}
</style>