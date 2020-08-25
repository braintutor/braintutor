const LinkModel = {
  type: {
    max_length: 10,
  },
  id: {
    max_length: 50,
  },
  url: {
    max_length: 300,
  },
  title: {
    max_length: 100,
  },
  description: {
    max_length: 500,
  },
  image: {
    max_length: 300,
  },
};

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

export { TaskModel, AnswerModel, LinkModel };
