// import router from "../router";

const knowledge_editor = [
  {
    questions: ["Hola"],
    answers: ["Hola @usuario@nombres."],
  },
  {
    questions: ["Gracias"],
    answers: ["Aquí estoy para ayudarte."],
  },
  // Course - Material
  {
    questions: ["¿Cómo creo una nueva unidad?"],
    answers: [
      'En la pestaña <strong>"Material"</strong> haga click en <strong>"Crear Unidad"</strong>.',
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
      'En la pestaña <strong>"Conocimiento"</strong> haga click en el ícono de <strong>"mensaje"</strong> (Agregar Conocimiento).',
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

export { knowledge_editor };
