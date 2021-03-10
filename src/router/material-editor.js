const routes = [
  {
    path: "/material-adaptative-editor/:material_id",
    name: "material-adaptative-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/MaterialAdaptativeEditor.vue"),
  },
  {
    path: "/material-file-editor/:material_id",
    name: "material-file-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/MaterialFileEditor.vue"),
  },
]
export default routes