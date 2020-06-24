import { CountVectorizer } from 'machinelearn/feature_extraction';

export default class Chatbot {
  constructor() {
    this.x = []
    this.y = []
    this.model = null
    this.knowledge = []
    // Voice
    this.msg = new SpeechSynthesisUtterance();
    this.msg.rate = 1.15;
    this.msg.pitch = 1
    window.speechSynthesis.onvoiceschanged = () => {
      let voices = window.speechSynthesis.getVoices()
      voices = voices.filter(voice => voice.lang.substring(0, 2) === 'es')
      if (voices[2]) this.msg.voice = voices[2] // or 3
    };
  }

  train(knowledge, entities) {
    this.knowledge = knowledge
    this.entities = entities

    this.knowledge.forEach(({ questions }, idx) => {
      this.x = this.x.concat(questions.map(question => this._getHash(question)))
      this.y = this.y.concat(Array(questions.length).fill(idx))
    })
    this.model = new CountVectorizer()
    this.model.fit_transform(this.x);
  }

  getAnswer(question) {
    if (this.model) {
      let sim_arr = []
      let vector = this.model.transform([this._getHash(question)])[0];
      this.model.transform(this.x).forEach(vectorK => {
        let similarity = this._cosinesim(vector, vectorK)
        sim_arr.push(similarity)
      })
      let idx_max_sim = sim_arr.indexOf(Math.max(...sim_arr))

      let res = this.knowledge[this.y[idx_max_sim]]
      res.answers = this.setEntities(res.answers)

      return res
    }
  }

  setEntities(answers) {
    return answers.map(answer => { // 'Hi @user@first_name @user@last_name.'
      let required_entities = answer.match(/@[\wñÑ]+@[\wñÑ]+/g) // [@user@first_name, @user@last_name] 
      if (required_entities)
        required_entities.forEach(required_entity => { // (1) @user@first_name  (2) @user@last_name
          let [object, attribute] = required_entity.split('@').slice(1, 3) // (1) [user, first_name]  (2) [user, last_name]
          answer = answer.replace(required_entities, this.entities[object][attribute]) // (1) Hi Mitsuo @user@last_name.  (2) Hi Mitsuo Yshara.
        })
      return answer
    })
  }

  talk(text) {
    this.msg.text = text
    let synth = window.speechSynthesis;
    synth.cancel()
    synth.speak(this.msg);
  }

  _clean(text) {
    text = text.toLowerCase()
    text = text.replace(/[^@_a-zá-úñÑ0-9\s]/g, ' ') // remove other characters
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accent
    text = text.trim().split(/\s+/) // remove extra spaces
    return `_${text.join('_')}_` // adding '_'
  }

  _getHash(text) {
    text = this._clean(text)
    let hash_arr = []
    for (let i = 0; i < text.length - 2; i++) {
      hash_arr.push(text.substring(i, i + 3));
    }
    return hash_arr.join(' ')
  }

  _cosinesim(A, B) {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;
    for (let i = 0; i < A.length; i++) { // here you missed the i++
      dotproduct += (A[i] * B[i]);
      mA += (A[i] * A[i]);
      mB += (B[i] * B[i]);
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = (dotproduct) / ((mA) * (mB)) || 0 // here you needed extra brackets
    return similarity;
  }
}