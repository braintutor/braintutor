const max_questions_per_evaluation = 50;

const Evaluation = {
  name: {
    max_length: 30,
  },
  content: {
    max_length: max_questions_per_evaluation,
    type: Array,
  },
};

export default Evaluation;
