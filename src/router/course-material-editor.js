const routes = [
    {
        path: "/course-editor/:course_id",
        meta: { roles: ["TEA"] },
        component: () => import("../views/CourseEditor.vue"),
        children: [
          {
            path: "",
            name: "course-editor",
            component: () => import("../components/CourseEditor/CourseContentEditor/index"),
          },
          {
            path: "knowledge",
            name: "course-editor-knowledge",
            component: () => import("../components/globals/KnowledgeEditor"),
          },
          {
            path: "preview",
            name: "course-editor-preview",
            component: () => import("../components/CourseEditor/CoursePreview"),
          },
          {
            path: "files",
            name: "course-editor-files",
            component: () => import("../components/CourseEditor/Files"),
          },
        ],
      },
      {
        path: "/material-editor/:material_id",
        name: "material-editor",
        meta: { roles: ["TEA"] },
        component: () => import("../views/MaterialEditor.vue"),
      },
]
export default routes