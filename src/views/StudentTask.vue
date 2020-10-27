<template>
  <div class="m-container">
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
          <input type="file" onclick="value = null" @change="onFileSelected" />
          <a
            v-for="(file, idx) in files_f"
            :key="idx"
            :href="file.url"
            target="_blank"
            class="file mt-3"
          >
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
            <span class="file__name">{{ file.name }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskCard from "@/components/globals/Task/TaskCard";

import { getTaskByStudent } from "@/services/taskService";

export default {
  data: () => ({
    task: null,
    text: {},
    files: [],
  }),
  computed: {
    files_f() {
      return this.files.map((f) => ({
        ...f,
        name: f.name.substring(f.name.lastIndexOf("/") + 1),
        type: f.content_type.split("/")[0],
      }));
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
.file {
  display: block;
  background: rgba(0, 0, 255, 0.075);
  border-radius: 6px;

  color: rgba(0, 0, 0, 0.75);
  text-decoration: none;
  cursor: pointer;

  display: flex;
  align-items: center;

  &__type {
    padding: 12px;
    border-right: 1px solid #ccc;

    display: flex;
    align-items: center;

    img {
      height: 32px;
      width: 32px;
    }
  }
  &__name {
    padding: 12px 18px;
  }
}
</style>