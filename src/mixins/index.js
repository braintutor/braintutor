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
  },
});
