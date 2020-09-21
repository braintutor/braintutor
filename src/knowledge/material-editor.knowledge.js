import default_knowledge from "./default.knowledge";

export default [
  ...default_knowledge,
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
  },
];
