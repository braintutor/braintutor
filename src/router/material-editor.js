const routes = [
  {
    path: "/material-adaptative-editor/:material_id",
    name: "material-adaptative-editor",
    meta: { roles: ["TEA"] },
    component: () => import("../views/MaterialAdaptativeEditor.vue"),
  },
]
export default routes