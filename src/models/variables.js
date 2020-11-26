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

  // FIREBASE
  max_session_size: 1000 * 1000 * 1000,
  max_task_size: 10 * 1000 * 1000
};

export default variables;
