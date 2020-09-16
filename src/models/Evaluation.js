import variables from "./variables";

const Evaluation = {
  name: {
    max_length: 50,
  },
  content: {
    max_length: variables.max_questions_per_evaluation,
    type: Array,
  },
};

export default Evaluation;
