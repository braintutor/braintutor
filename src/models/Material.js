import variables from "./variables";

const Material = {
  name: {
    max_length: 100,
  },
  quizzes: {
    max_length: variables.max_questions_per_material,
    type: Array,
  },
  data_fs: {
    document: {
      max_length: 500000,
    },
    overview: {
      max_length: 300,
    },
    exercises: {
      max_length: variables.max_questions_per_material,
      type: Array,
    },
    faq: {
      max_length: variables.max_questions_per_material,
      type: Array,
    },
  }
};

export default Material;
