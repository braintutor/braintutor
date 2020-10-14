import { _fetch, fetch_get } from "./helpers";

import Classroom from "./classroom";
import Evaluation from "./evaluation";
import Event from "./event";
import Session from "./session";
import Student from "./student";
import Task from "./task";

export default {
  install(Vue) {
    const repositories = {
      classroom: Classroom(fetch_get),
      evaluation: Evaluation(_fetch, fetch_get),
      event: Event(fetch_get),
      session: Session(fetch_get),
      student: Student(fetch_get),
      task: Task(fetch_get),
    };
    Vue.prototype.$api = repositories;
  },
};
