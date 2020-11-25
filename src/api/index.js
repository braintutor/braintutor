import { _fetch, fetch_get } from "./helpers";

import Classroom from "./classroom";
import Evaluation from "./evaluation";
import Event from "./event";
import Session from "./session";
import Course from "./course";
import Student from "./student";
import Teacher from "./teacher";
import Task from "./task";
import School from "./school";
import Material from "./material";
import Unit from "./unit";
import File from "./file";
import Report from "./report";
import Grade from "./grade";
import Section from "./section";
// import Message from "./message";

export default {
  install(Vue) {
    const repositories = {
      classroom: Classroom(fetch_get),
      evaluation: Evaluation(_fetch, fetch_get),
      event: Event(fetch_get),
      session: Session(_fetch),
      student: Student(_fetch),
      teacher: Teacher(_fetch),
      task: Task(_fetch),
      school: School(_fetch),
      material: Material(_fetch),
      unit: Unit(_fetch),
      file: File(_fetch),
      report: Report(_fetch),
      course: Course(_fetch),
      grade: Grade(_fetch),
      section: Section(_fetch),
      // message: Message(_fetch),
    };
    Vue.prototype.$api = repositories;
  },
};
