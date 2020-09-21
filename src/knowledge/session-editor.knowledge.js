import default_knowledge from "./default.knowledge";
import { question_template_show, question_template_create } from "./helper";

export default [
  ...default_knowledge,
  //Task
  {
    questions: [
      ...question_template_create("tarea"),
      ...question_template_create("trabajo"),
    ],
    answers: [
      'En la pestaña <strong>"Tareas"</strong> haga click en <strong>"+ Crear Tarea"</strong>.',
    ],
  },
  {
    questions: [
      ...question_template_show("las respuestas de una tarea"),
      ...question_template_show("las respuestas de un trabajo"),
      ...question_template_show("los resultados de una tarea"),
      ...question_template_show("los resultados de un trabajo"),
    ],
    answers: [
      'En la pestaña <strong>"Tareas"</strong> haga click en <strong>"Ver Respuestas"</strong>.',
    ],
  },
  //Evaluation
  {
    questions: [
      ...question_template_create("evaluación"),
      ...question_template_create("examen"),
    ],
    answers: [
      'En la pestaña <strong>"Evaluaciones"</strong> haga click en <strong>"+ Crear Evaluación"</strong>.',
    ],
  },
  {
    questions: [
      ...question_template_show("los resultados de una evaluación"),
      ...question_template_show("los resultados de un examen"),
      ...question_template_show("las notas de un evaluación"),
      ...question_template_show("las notas de un examen"),
    ],
    answers: [
      'En la pestaña <strong>"Evaluaciones"</strong> haga click en el ícono <strong><i class="mdi mdi-poll" style="font-size: 1.2rem;"></i> "Resultados"</strong>.',
    ],
  },
];
