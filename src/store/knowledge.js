// import router from "../router";
const Knowledge_personal = [
  {
    questions: ["Hola"],
    answers: ["Hola @usuario@nombres."],
  },
  {
    questions: ["Chau"],
    answers: ["Adiós, nos vemos pronto."],
  },
  {
    questions: ["Gracias"],
    answers: ["Aquí estoy para ayudarte."],
  },
  {
    questions: ["¿Qué eres?", "¿Qué haces?"],
    answers: ["Soy un bot programado para ayudarte."],
  },
];

const knowledge_course_editor = [
  ...Knowledge_personal,
  // Course - Material
  {
    questions: ["¿Cómo creo una nueva unidad?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> haga click en <strong>"Crear Unidad"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo modifico el nombre de una unidad?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> en las opciones de la unidad, haga click en <strong>"Editar Nombre"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo modifico el orden de los materiales en una unidad?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> en las opciones de la unidad, haga click en <strong>"Editar Orden"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo elimino una unidad?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> en las opciones de la unidad, haga click en <strong>"Eliminar"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo creo un nuevo material?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> en las opciones de la unidad, haga click en <strong>"Crear Material"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo modifico un material?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> posicione el cursor sobre el material y haga click en el ícono de <strong>"Editar Material"</strong>.',
    ],
  },
  // Course - Knowledge
  {
    questions: ["¿Cómo agrego más conocimiento?"],
    answers: [
      'En la pestaña <strong>"Conocimiento"</strong> haga click en el ícono de <strong>"Agregar Conocimiento"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo borro los cambios hechos en conocimiento?"],
    answers: [
      'En la pestaña <strong>"Conocimiento"</strong> haga click en el ícono de <strong>"Restaurar Cambios"</strong>.',
    ],
  },
  {
    questions: ["¿Cómo guardo los cambios hechos en conocimiento?"],
    answers: [
      'En la pestaña <strong>"Conocimiento"</strong> haga click en el ícono de <strong>"Guardar Cambios"</strong>.',
    ],
  },
  // Course - Preview
  {
    questions: ["¿Cómo veo los cambios?"],
    answers: [
      'Puede ver los cambios en la pestaña <strong>"Vista Previa"</strong>.',
    ],
    // actions: [
    //   {
    //     text: "sdf",
    //     action: () => {
    //       router.push("/").catch(() => {});
    //     },
    //   },
    // ],
  },
];
const knowledge_session_editor = [
  ...Knowledge_personal,
  //Task
  {
    questions: [
      ...question_template_create("tarea"),
      ...question_template_create("trabajo"),
    ],
    answers: [
      'En la pestaña <strong>"Tareas"</strong> haga click en <strong>"Crear +"</strong>.',
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
      'En la pestaña <strong>"Tareas"</strong> haga click en el ícono de <strong>"Ver Respuestas"</strong>.',
    ],
  },
  //Evaluation
  {
    questions: [
      ...question_template_create("evaluacion"),
      ...question_template_create("examen"),
    ],
    answers: [
      'En la pestaña <strong>"Evaluaciones"</strong> haga click en el ícono de <strong>"Crear"</strong>.',
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
      'En la pestaña <strong>"Evaluaciones"</strong> haga click en el ícono de <strong>"Resultados"</strong>.',
    ],
  },
];

function question_template_create(text) {
  return [
    "Donde creo una @?",
    "¿Cómo creo una @?",
    "Quiero crear una @",
    "¿Cómo agrego más tareas?",
  ].map((t) => t.replace("@", text));
}
function question_template_show(text) {
  return [
    "¿Dónde puedo ver @?",
    "Quiero ver @",
    "¿Cómo visualizo @?",
  ].map((t) => t.replace("@", text));
}

export { knowledge_course_editor, knowledge_session_editor };
