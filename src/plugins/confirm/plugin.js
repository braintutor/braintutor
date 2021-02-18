import ConfirmDialog from "./component";
import { events } from './events'

const typesConfirm = {
  delete: {
    title: "¿Desea eliminar?",
    message: "",
    accion: "Eliminar",
    color: "error"
  },
  default: {
    title: "¿Esta seguro de realizar esta acción?",
    message: "",
    accion: "Si",
    color: "primary"
  },
};

export default {
  install(Vue, args = {}) {
    if (this.installed) return;
    this.installed = true;
    this.params = args;
    Vue.component('vue-confirm', ConfirmDialog)

    const confirm = (params) => {
      if (typeof params != "object" || Array.isArray(params)) {
        let caughtType = typeof params;
        if (Array.isArray(params)) caughtType = "array";

        throw new Error(
          `Options type must be an object. Caught: ${caughtType}. Expected: object`
        );
      }

      if (typeof params === "object") {
        if (
          params.hasOwnProperty("callback") &&
          typeof params.callback != "function"
        ) {
          let callbackType = typeof params.callback;
          throw new Error(
            `Callback type must be an function. Caught: ${callbackType}. Expected: function`
          );
        }

        typesConfirm
        events.$emit("open", params);
      }
    };
    confirm.close = () => {
      events.$emit("close");
    };
    Vue.prototype.$confirm = (params, type = 'default') => {
      const payload = { ...typesConfirm[type], ...params }
      confirm(payload);
    }
  },
};
