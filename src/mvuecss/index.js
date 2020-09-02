import Vue from "vue";
import "./styles/main.scss";

Vue.component("m-btn", () => import("./components/MBtn"));
Vue.component("m-alert", () => import("./components/MAlert"));
Vue.component("m-card", () => import("./components/MCard"));
Vue.component("m-dialog", () => import("./components/MDialog"));
Vue.component("m-calendar", () => import("./components/MCalendar"));

Vue.component("m-sidebar", () => import("./components/MSidebar"));
