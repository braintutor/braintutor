import { fetch_get } from "./helpers";

import Classroom from "./classroom";
import Student from "./student";
import Session from "./session";
import Evaluation from "./evaluation";

export default {
  install(Vue) {
    const repositories = {
      classroom: Classroom(fetch_get),
      student: Student(fetch_get),
      session: Session(fetch_get),
      evaluation: Evaluation(fetch_get),
    };
    Vue.prototype.$api = repositories;
  },
};
