import Vue from "vue";

Vue.mixin({
  methods: {
    showLoading(msg) {
      this.$store.state.loading = true;
      this.$store.state.loading_msg = msg;
    },
    hideLoading() {
      this.$store.state.loading = false;
    },
    showMessage(title, description) {
      this.$root.$children[0].showMessage(title, description);
    },
    // Format objects
    formatObjects(arr) {
      return arr.map((obj) => this.formatObject(obj));
    },
    // TODO make recurrent for child objects
    formatObject(obj) {
      let new_obj = {};
      Object.entries(obj).forEach(([key, val]) => {
        if (typeof val === "object") {
          if (val instanceof Array) {
            new_obj[key] = val;
          } else {
            if ("$oid" in val) {
              new_obj[key] = val.$oid;
            } else if ("$date" in val) {
              new_obj[key] = new Date(val.$date);
            } else {
              new_obj[key] = val;
            }
          }
        } else {
          new_obj[key] = val;
        }
      });
      return new_obj;
    },
  },
});
