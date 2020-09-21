import default_knowledge from "./default.knowledge";
import { question_template_create } from "./helper";

export default [
  ...default_knowledge,
  // Material - Category
  // Material - Editor
  // Material - Quiz
  {
    questions: [
      ...question_template_create("evaluación"),
      ...question_template_create("examen"),
      ...question_template_create("prueba"),
    ],
    answers: [
      'En la pestaña <strong>"Pruebas"</strong> puede crear pruebas por distintos niveles <strong>(Básico, Intermedio, Avanzado)</strong>.',
    ],
  },
  // Material - Settings
  // {
  //   questions: ["¿Cómo elimino un material?"],
  //   answers: [
  //     'En la pestaña <strong>"Configuración"</strong> haga click en botón <strong>"Eliminar Material"</strong>.',
  //   ],
  // },
];
