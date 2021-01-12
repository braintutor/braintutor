import { render, within } from '@testing-library/vue'
import EvaluationResults from '../EvaluationResults.vue'

import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)

// Custom container to integrate Vuetify with Vue Testing Library.
// Vuetify requires you to wrap your app with a v-app component that provides
// a <div data-app="true"> node.
const renderWithVuetify = (component, options, callback) => {
  const root = document.createElement('div')
  root.setAttribute('data-app', 'true')

  return render(
    component,
    {
      container: document.body.appendChild(root),
      // for Vuetify components that use the $vuetify instance property
      vuetify: new Vuetify(),
      ...options,
    },
    callback,
  )
}

test('mostrar resultados', async () => {
  const { getByText } = renderWithVuetify(EvaluationResults, {
    props: {
      evaluation: {
        "content": [
          {
            "question": "Que entiendes por contaminación pesquera?",
            "image": "",
            "alternatives": ["Alternativa 1", "Alternativa 2"], "correct": 0
          },
          {
            "question": "Cuales son las causas de deterioro de calidad del agua?",
            "image": "",
            "alternatives": ["Alternativa 1", "Alternativa 2"], "correct": 0
          },
          {
            "question": "Responde V si es verdadero y F si es falso", "image": "",
            "alternatives": ["la sierra ", "en la costa ", "en la sierra predomina la agricultura de secano"], "correct": 0
          },
          {
            "question": "algo",
            "alternatives": ["a", "b", "c"],
            "correct": 1
          }
        ],
        "results": [
          {
            "_id": "5f6c0999c0e51fc874e73461",
            "answers": [0, 1, -1, 1],
            "time_end": "2021-01-10T23:36:16.116Z"
          }]
      },
      students: [
        {
          "_id": "5f6a4a3e200569a99996dd0f",
          "first_name": "Mitsuo",
          "last_name": "Mitsuo",
        },
        {
          "_id":"5f6c0999c0e51fc874e73461",
          "first_name":"Prueba",
          "last_name":"Alumno"
        }
      ],
      buttons: []
    }
  })

  let row = getByText("Alumno, Prueba").closest("tr");
  let utils = within(row);
  expect(utils.getByTitle("correctas").textContent).toEqual("2")
  expect(utils.getByTitle("incorrectas").textContent).toEqual("1")
  expect(utils.getByTitle("vacias").textContent).toEqual("1")

  row = getByText("Mitsuo, Mitsuo").closest("tr");
  utils = within(row);
  expect(utils.getByTitle("correctas").textContent).toEqual("0")
  expect(utils.getByTitle("incorrectas").textContent).toEqual("0")
  expect(utils.getByTitle("vacias").textContent).toEqual("4")
})