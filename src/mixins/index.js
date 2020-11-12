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
    // DATE
    dateToInput(date) {
      let date_f = new Date();
      date_f.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      date_f = date_f.toISOString().substring(0, 16);
      return date_f;
    },
    formatDate(date) {
      let options = {
        month: "long",
        day: "numeric",
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      };
      let date_format = date.toLocaleDateString("es-ES", options);
      date_format = date_format.charAt(0).toUpperCase() + date_format.slice(1);
      return date_format;
    },
    formatDateTime(date, long = true) {
      return date.toLocaleString("es-ES", {
        // weekday: 'short', // "Sat"
        day: "2-digit", // "15"
        month: long ? "long" : "2-digit", // "junio"
        year: "numeric", // "1997"
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    // HTML
    toHTML(text = "") {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function (url) {
        return `<a href="${url}" target="_blank">${url}</a>`;
      });
    },
    // Format objects from Mongo
    mongoArr(arr) {
      return arr.map((obj) => this.mongo(obj));
    },
    mongo(obj) {
      if (obj == null) return obj;
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
