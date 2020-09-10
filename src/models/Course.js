const max_knowledge_per_course = 50;

const Course = {
  name: {
    max_length: 30,
  },
  knowledge: {
    max_length: max_knowledge_per_course,
    type: Array,
  },
};

export default Course;
