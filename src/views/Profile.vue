<template>
  <div class="container pa-0">
    <loading :active="loading" />
    <div v-if="!loading" class="profile m-card">
      <span class="profile__item">Id:</span>
      <span>{{profile._id.$oid}}</span>
      <span class="profile__item">Nombres:</span>
      <span>{{profile.first_name}}</span>
      <span class="profile__item">Apellidos:</span>
      <span>{{profile.last_name}}</span>
      <span class="profile__item">Usuario:</span>
      <span>{{profile.user}}</span>
    </div>

    <div class="test m-card">
      <div class="text-center ma-4">
        <h1>Cuestionario de Estilos de Aprendizaje</h1>
      </div>
      <div class="test__question" v-for="(question, q_idx) in questions" :key="q_idx">
        <h3>{{(q_idx + 1)}}. {{question.enunciado}}</h3>
        <v-radio-group v-model="question.answer">
          <v-radio
            v-for="(alternative, a_idx) in question.alternatives"
            :key="a_idx"
            :label="alternative"
            :value="a_idx"
          ></v-radio>
        </v-radio-group>
      </div>
      <div class="d-flex justify-center my-4">
        <v-btn color="primary" @click="saveTest()">Guardar</v-btn>
      </div>
    </div>

    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="300">
      <v-card>
        <v-card-title>Error</v-card-title>
        <v-card-text>Por favor no dejes preguntas sin responder.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small text @click="dialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import loading from "@/components/loading";

import { getProfile, updateLearningStyle } from "@/services/studentService";

class PreguntaTest {
  constructor(enunciado, alternatives) {
    this.enunciado = enunciado;
    this.alternatives = alternatives;
    this.answer = null;
    // this.answer = Math.round(Math.random());
  }
}

export default {
  data: () => ({
    profile: {},
    questions: [
      /* 1 - 11 */
      new PreguntaTest("Entiendo mejor algo", [
        "si lo practico",
        "si pienso en ello"
      ]),
      new PreguntaTest("Me considero", ["realista", "innovador"]),
      new PreguntaTest(
        "Cuando pienso acerca de lo que hice ayer, es más probable que lo haga sobre la base de",
        ["una imagen", "palabras"]
      ),
      new PreguntaTest("Tengo tendencia a", [
        "entender los detalles de un tema pero no ver claramente su estructura completa",
        "entender la estructura completa pero no ver claramente los detalles"
      ]),
      new PreguntaTest("Cuando estoy aprendiendo algo nuevo, me ayuda", [
        "hablar de ello",
        "pensar en ello"
      ]),
      new PreguntaTest("Si yo fuera profesor, yo preferiría dar un curso", [
        "que trate sobre hechos y situaciones reales de la vida",
        "que trate con ideas y teorías"
      ]),
      new PreguntaTest("Prefiero obtener información nueva de", [
        "imágenes, diagramas, gráficas o mapas",
        "instrucciones escritas o información verbal"
      ]),
      new PreguntaTest("Una vez que entiendo", [
        "todas las partes, entiendo el total",
        "el total de algo, entiendo como encajan sus partes"
      ]),
      new PreguntaTest(
        "En un grupo de estudio que trabaja con un material difícil, es más probable que",
        ["participe y contribuya con ideas", "no participe y solo escuche"]
      ),
      new PreguntaTest("Es más fácil para mí", [
        "aprender hechos",
        "aprender conceptos"
      ]),
      new PreguntaTest(
        "En un libro con muchas imágenes y gráficas es más probable que",
        [
          "revise cuidadosamente las imágenes y las gráficas",
          "me concentre en el texto escrito"
        ]
      ),
      /* 12 - 22 */
      new PreguntaTest("Cuando resuelvo problemas de matemáticas", [
        "generalmente trabajo sobre las soluciones con un paso a la vez",
        "frecuentemente sé cuales son las soluciones, pero luego tengo dificultad para imaginarme los pasos para llegar a ellas"
      ]),
      new PreguntaTest("En las clases a las que he asistido", [
        "he llegado a saber como son muchos de los estudiantes",
        "raramente he llegado a saber como son muchos estudiantes"
      ]),
      new PreguntaTest("Cuando leo temas que no son de ficción, prefiero", [
        "algo que me enseñe nuevos hechos o me diga como hacer algo",
        "algo que me dé nuevas ideas en que pensar"
      ]),
      new PreguntaTest("Me gustan los maestros", [
        "que utilizan muchos esquemas en el pizarrón",
        "que toman mucho tiempo para explicar"
      ]),
      new PreguntaTest("Cuando estoy analizando un cuento o una novela", [
        "pienso en los incidentes y trato de acomodarlos para configurar los temas",
        "me doy cuenta de cuáles son los temas cuando termino de leer y luego tengo que regresar y encontrar los incidentes que los demuestran"
      ]),
      new PreguntaTest(
        "Cuando comienzo a resolver un problema de tarea, es más probable que",
        [
          "comience a trabajar en su solución inmediatamente",
          "primero trate de entender completamente el problema"
        ]
      ),
      new PreguntaTest("Prefiero la idea de", ["certeza", "teoría"]),
      new PreguntaTest("Recuerdo mejor", ["lo que veo", "lo que oigo"]),
      new PreguntaTest("Es más importante para mí que un profesor", [
        "exponga el material en pasos secuenciales claros",
        "me dé un panorama general y relacione el material con otros temas"
      ]),
      new PreguntaTest("Prefiero estudiar", ["en un grupo de estudio", "solo"]),
      new PreguntaTest("Me considero", [
        "cuidadoso en los detalles de mi trabajo",
        "creativo en la forma en la que hago mi trabajo"
      ]),
      /* 23 - 33 */
      new PreguntaTest(
        "Cuando alguien me da direcciones de nuevos lugares, prefiero",
        ["un mapa", "instrucciones escritas"]
      ),
      new PreguntaTest("Aprendo", [
        "a un paso constante. Si estudio con ahínco consigo lo que deseo",
        "en inicios y pausas. Me llego a confundir y súbitamente lo entiendo"
      ]),
      new PreguntaTest("Prefiero primero", [
        "hacer algo y ver que sucede",
        "pensar como voy a hacer algo"
      ]),
      new PreguntaTest(
        "Cuando leo por diversión, me gustan los escritores que",
        [
          "dicen claramente los que desean dar a entender",
          "dicen las cosas en forma creativa e interesante"
        ]
      ),
      new PreguntaTest(
        "Cuando veo un esquema o bosquejo en clase, es más probable que recuerde",
        ["la imagen", "lo que el profesor dijo acerca de ella"]
      ),
      new PreguntaTest("Cuando me enfrento a un cuerpo de información", [
        "me concentro en los detalles y pierdo de vista el total de la misma",
        "trato de entender el todo antes de ir a los detalles"
      ]),
      new PreguntaTest("Recuerdo más fácilmente", [
        "algo que he hecho",
        "algo en lo que he pensado mucho"
      ]),
      new PreguntaTest("Cuando tengo que hacer un trabajo, prefiero", [
        "dominar una forma de hacerlo",
        "intentar nuevas formas de hacerlo"
      ]),
      new PreguntaTest("Cuando alguien me enseña datos, prefiero", [
        "gráficas",
        "resúmenes con texto"
      ]),
      new PreguntaTest("Cuando escribo un trabajo, es más probable que", [
        "lo haga (piense o escriba) desde el principio y avance",
        "lo haga (piense o escriba) en diferentes partes y luego las ordene"
      ]),
      new PreguntaTest(
        "Cuando tengo que trabajar en un proyecto de grupo, primero quiero",
        [
          'realizar una "tormenta de ideas" donde cada uno contribuye con ideas',
          'realizar la "tormenta de ideas" en forma personal y luego juntarme con el grupo para comparar las ideas'
        ]
      ),
      /* 34 - 44 */
      new PreguntaTest("Considero que es mejor elogio llamar a alguien", [
        "sensible",
        "imaginativo"
      ]),
      new PreguntaTest(
        "Cuando conozco gente en una fiesta, es más probable que recuerde",
        ["cómo es su apariencia", "lo que dicen de sí mismos"]
      ),
      new PreguntaTest("Cuando estoy aprendiendo un tema, prefiero", [
        "mantenerme concentrado en ese tema, aprendiendo lo más que pueda de él",
        "hacer conexiones entre ese tema y temas relacionados"
      ]),
      new PreguntaTest("Me considero", ["abierto", "reservado"]),
      new PreguntaTest("Prefiero cursos que dan más importancia a", [
        "material concreto (hechos, datos)",
        "material abstracto (conceptos, teorías)"
      ]),
      new PreguntaTest("Para divertirme, prefiero", [
        "ver televisión",
        "leer un libro"
      ]),
      new PreguntaTest(
        "Algunos profesores inician sus clases haciendo un bosquejo de lo que enseñarán. Esos bosquejos son",
        ["algo útiles para mí", "muy útiles para mí"]
      ),
      new PreguntaTest(
        "La idea de hacer una tarea en grupo con una sola calificación para todos",
        ["me parece bien", "no me parece bien"]
      ),
      new PreguntaTest("Cuando hago grandes cálculos", [
        "tiendo a repetir todos mis pasos y revisar cuidadosamente mi trabajo",
        "me cansa hacer su revisión y tengo que esforzarme para hacerlo"
      ]),
      new PreguntaTest("Tiendo a recordar lugares en los que he estado", [
        "fácilmente y con bastante exactitud",
        "con dificultad y sin mucho detalle"
      ]),
      new PreguntaTest(
        "Cuando resuelvo problemas en grupo, es más probable que yo",
        [
          "piense en los pasos para la solución de los problemas",
          "piense en las posibles consecuencias o aplicaciones de la solución en un amplio rango de campos"
        ]
      )
    ],
    loading: true,
    dialog: false
  }),
  async mounted() {
    this.profile = await getProfile();
    this.loading = false;
  },
  methods: {
    async saveTest() {
      let answers = this.questions.map(q => q.answer);
      if (!answers.includes(null)) {
        this.loading = true;
        let learning_style = this.calculate(answers);
        await updateLearningStyle(learning_style);
        this.loading = false;
      } else {
        this.dialog = true;
      }
    },
    calculate(respuestas) {
      //Dimension Procesamiento
      var procesamiento = "";
      var procesamiento_valor = 0;
      var activo = 0;
      var reflexivo = 0;

      var i = 0;

      for (i = 0; i < respuestas.length; i = i + 4) {
        if (respuestas[i] == 0) {
          activo += 1;
        } else {
          reflexivo += 1;
        }
      }

      if (activo > reflexivo) {
        procesamiento = "activo";
        procesamiento_valor = activo - reflexivo;
      } else {
        procesamiento = "reflexivo";
        procesamiento_valor = reflexivo - activo;
      }

      //Dimension Percepcion
      var percepcion = "";
      var percepcion_valor = 0;
      var sensorial = 0;
      var intuitivo = 0;

      for (i = 1; i < respuestas.length; i = i + 4) {
        if (respuestas[i] == 0) {
          sensorial += 1;
        } else {
          intuitivo += 1;
        }
      }

      if (sensorial > intuitivo) {
        percepcion = "sensorial";
        percepcion_valor = sensorial - intuitivo;
      } else {
        percepcion = "intuitivo";
        percepcion_valor = intuitivo - sensorial;
      }

      //Dimension Entrada
      var entrada = "";
      var entrada_valor = 0;
      var visual = 0;
      var verbal = 0;

      for (i = 2; i < respuestas.length; i = i + 4) {
        if (respuestas[i] == 0) {
          visual += 1;
        } else {
          verbal += 1;
        }
      }

      if (visual > verbal) {
        entrada = "visual";
        entrada_valor = visual - verbal;
      } else {
        entrada = "verbal";
        entrada_valor = verbal - visual;
      }

      //Dimension Comprension
      var comprension = "";
      var comprension_valor = 0;
      var secuencial = 0;
      var global = 0;

      for (i = 3; i < respuestas.length; i = i + 4) {
        if (respuestas[i] == 0) {
          secuencial += 1;
        } else {
          global += 1;
        }
      }

      if (secuencial > global) {
        comprension = "secuencial";
        comprension_valor = secuencial - global;
      } else {
        comprension = "global";
        comprension_valor = global - secuencial;
      }

      //Resultado
      let perfil = {
        procesamiento: procesamiento,
        procesamiento_valor: procesamiento_valor,
        percepcion: percepcion,
        percepcion_valor: percepcion_valor,
        entrada: entrada,
        entrada_valor: entrada_valor,
        comprension: comprension,
        comprension_valor: comprension_valor
      };
      return perfil;
    }
  },
  components: {
    loading
  }
};
</script>

<style lang='scss' scoped>
.profile {
  padding: 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 30px;
  grid-row-gap: 10px;

  &__item {
    font-weight: bold;
  }
}

.test {
  margin: 20px 0;
  padding: 20px;
  &__question {
    padding: 10px 0;
  }
}
</style>