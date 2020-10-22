import variables from "./variables";

const Question = {
  question: {
    max_length: 1000,
  },
  alternatives: {
    max_length: variables.max_alternatives_per_question,
    type: Array,
  },
  alternative: {
    max_length: 300,
  },
};

export default Question;
