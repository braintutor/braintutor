import { _fetch, Fetch } from "./helpers";

import Evaluation from "./evaluation";
import EvaluationResult from "./evaluationResult";
import Event from "./event";
import Session from "./session";
import Course from "./course";
import CourseMaterial from "./courseMaterial";
import Student from "./student";
import Teacher from "./teacher";
import Director from "./director";
import Task from "./task";
import School from "./school";
import Material from "./material";
import Syllabus from "./syllabus";
import Unit from "./unit";
import File from "./file";
import Report from "./report";
import Grade from "./grade";
import Section from "./section";
import Subject from "./subject";
import Marketplace from "./marketplace";


export default {
  install(Vue) {
    const repositories = {
      evaluation: Evaluation(_fetch),
      evaluation_result: EvaluationResult(_fetch),
      event: Event(_fetch),
      session: Session(_fetch),
      student: Student(_fetch),
      teacher: Teacher(_fetch),
      director: Director(_fetch),
      task: Task(_fetch),
      school: School(_fetch),
      material: Material(_fetch, Fetch),
      syllabus: Syllabus(_fetch),
      unit: Unit(_fetch),
      file: File(_fetch, Fetch),
      report: Report(_fetch),
      course: Course(_fetch),
      courseMaterial: CourseMaterial(_fetch),
      grade: Grade(_fetch),
      section: Section(_fetch),
      subject: Subject(_fetch),
      marketplace: Marketplace(_fetch)
    };
    Vue.prototype.$api = repositories;
  },
};
