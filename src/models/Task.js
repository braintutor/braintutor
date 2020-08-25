const AnswerModel = {
  text: {
    max_length: 300,
  },
  data: {
    max_length: 5,
    type: Array,
  },
};

const TaskModel = {
  title: {
    max_length: 100,
  },
  description: {
    max_length: 300,
  },
};

export { TaskModel, AnswerModel };
