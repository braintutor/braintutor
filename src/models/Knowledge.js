const max_questions_per_knowledge = 5;
const max_answers_per_knowledge = 5;

const Knowledge = {
  questions: {
    max_length: max_questions_per_knowledge,
    type: Array,
  },
  question: {
    max_length: 100,
  },
  answers: {
    max_length: max_answers_per_knowledge,
    type: Array,
  },
  answer: {
    max_length: 100,
  },
};

export default Knowledge;
