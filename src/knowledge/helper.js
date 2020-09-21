function question_template_create(text) {
  return [
    `Donde creo una ${text}`,
    `¿Cómo creo una ${text}`,
    `Quiero crear una ${text}`,
    `¿Cómo agrego más ${text}`,
  ];
}
function question_template_show(text) {
  return [
    `¿Dónde puedo ver ${text}`,
    `Quiero ver ${text}`,
    `¿Cómo visualizo ${text}`,
  ];
}

export { question_template_create, question_template_show };
