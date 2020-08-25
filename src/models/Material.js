const max_questions_per_material = 10;

const Material = {
  name: {
    max_length: 100,
  },
  document: {
    max_length: 500000,
  },
  overview: {
    max_length: 300,
  },
  exercises: {
    max_length: max_questions_per_material,
    type: Array,
  },
  faq: {
    max_length: max_questions_per_material,
    type: Array,
  },
  quizzes: {
    max_length: max_questions_per_material,
    type: Array,
  },
};

export default Material;
