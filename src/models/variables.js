import sum from "lodash/fp/sum"

// very simple implementation of quantity pattern, see Analysis Patterns
export class Megabytes {
  static fromBytes(bytes) {
    return new Megabytes(bytes / 1000 / 1000)
  }

  constructor(amount){
    this.amount = amount
    this.unit = "MB"
  }

  toString() {
    const amountStr = this.amount < 1? (this.amount).toFixed(2): this.amount
    return `${amountStr} ${this.unit}`
  }
}

export const current_size = files => {
  return Megabytes.fromBytes(sum(files.map(f => f.size)));
}

const variables = {
  max_users_per_school: 1000, // addStudent, addTeacher
  max_courses_per_school: 100, // addCourse
  max_sessions_per_school: 100, // addSession

  max_units_per_course: 20, // addUnit
  max_materials_per_course: 100, // addMaterial

  max_evaluations_per_session: 100, // addEvaluation
  max_events_per_session: 100, // addEvent
  max_tasks_per_session: 100, // addTask

  //
  max_questions_per_evaluation: 50,
  max_questions_per_material: 20,
  max_alternatives_per_question: 10,

 
};

// FIREBASE
export const max_session_size = new Megabytes(1000)
export const max_task_size = new Megabytes(10) // TODO: andre cambiar esto a new Megabytes(10)

export default variables;
