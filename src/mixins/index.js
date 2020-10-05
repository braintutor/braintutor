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
    // Format objects from Mongo
    mongoArr(arr) {
      return arr.map((obj) => this.mongo(obj));
    },
    mongo(obj) {
      if (typeof obj !== "object") return obj;

      let new_obj = {};
      Object.entries(obj).forEach(([key, val]) => {
        if (typeof val === "object") {
          if (val instanceof Array) {
            new_obj[key] = val.map((obj) => this.mongo(obj));
          } else {
            if (val) {
              if ("$oid" in val) {
                new_obj[key] = val.$oid;
              } else if ("$date" in val) {
                new_obj[key] = new Date(val.$date);
              } else {
                new_obj[key] = val;
              }
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
    // Date
    orderObjectsByDate(arr, key = "date", desc = true) {
      arr.sort((a, b) => (b[key] - a[key]) * (desc ? 1 : -1));
      return arr;
    },
  },
});
