const max_alternatives_per_question = 10;

const Question = {
  question: {
    max_length: 300,
  },
  alternatives: {
    max_length: max_alternatives_per_question,
    type: Array,
  },
  alternative: {
    max_length: 100,
  },
};

export default Question;
