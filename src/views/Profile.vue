<template>
  <div class="m-container">
    <div class="profile m-card">
      <div class="m-card__body">
        <h2 class="profile__title">Mis Datos</h2>
        <div class="profile__content">
          <!--  -->
          <v-icon class="profile__icon">mdi-card-account-details</v-icon>
          <span class="profile__item">Nombres:</span>
          <span class="profile__value">{{ profile.first_name }}</span>
          <!--  -->
          <v-icon class="profile__icon">mdi-card-account-details</v-icon>
          <span class="profile__item">Apellidos:</span>
          <span class="profile__value">{{ profile.last_name }}</span>
          <!--  -->
          <v-icon class="profile__icon">mdi-account</v-icon>
          <span class="profile__item">Usuario:</span>
          <span class="profile__value">{{ profile.username }}</span>
        </div>
      </div>
      <div class="m-card__actions">
        <m-btn
          @click="
            current_password = '';
            new_password = '';
            confirm_new_password = '';
            dialog_password = true;
          "
          color="primary"
          small
          >Cambiar Contraseña</m-btn
        >
      </div>
    </div>
    <div v-show="user_role === 'STU'" class="diagram m-card">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-show="profile.learning_style"
            @click="dialog_test_2 = true"
            color="primary"
            icon
            small
            v-bind="attrs"
            v-on="on"
            class="mb-3"
            style="display: block; margin-left: auto"
            ><v-icon style="font-size: 1.2rem">mdi-help</v-icon></v-btn
          >
        </template>
        <span>Saber Más</span>
      </v-tooltip>
      <canvas
        v-show="profile.learning_style"
        id="myChart"
        width="600"
        height="400"
      ></canvas>
      <div v-show="!profile.learning_style" class="no-style">
        Realiza un test para obtener tu estilo de aprendizaje
      </div>
      <div class="diagram__actions">
        <m-btn @click="newTest()" small color="primary" text>Nuevo Test</m-btn>
      </div>
    </div>
    <!-- DLG TEST -->
    <v-dialog v-model="dialog_test" max-width="1000">
      <div id="test" class="test m-card">
        <div class="d-flex justify-space-between align-center close-m">
          <h2 class="test__title">Cuestionario de Estilos de Aprendizaje</h2>
          <v-btn icon small @click="dialog_test =false">
            <v-icon>mdi-close-thick</v-icon>
          </v-btn>
        </div>        
        <p class="test__page">Página {{ questions_page + 1 }} de 4</p>
        <div class="test__content">
          <div
            class="test__question"
            v-for="(question, q_idx) in _questions"
            :key="q_idx"
          >
            <h3 class="test__question-title">
              <v-btn @click="talk(question.enunciado)" icon small class="mr-2">
                <v-icon style="font-size: 1.3rem">mdi-volume-high</v-icon>
              </v-btn>
              <span>{{ q_idx + 1 }}. {{ question.enunciado }}</span>
            </h3>
            <v-radio-group v-model="question.answer">
              <v-radio
                v-for="(alternative, a_idx) in question.alternatives"
                :key="a_idx"
                :label="alternative"
                :value="a_idx"
              ></v-radio>
            </v-radio-group>
          </div>
        </div>
        <div class="test__actions">
          <v-btn
            v-if="questions_page !== 0"
            color="primary"
            @click="changePage(-1)"
            small
            class="mr-3"
            >Anterior</v-btn
          >
          <v-btn
            v-if="questions_page !== 3"
            color="primary"
            @click="changePage(1)"
            small
            >Siguiente</v-btn
          >
          <v-btn
            v-if="questions_page === 3"
            color="success"
            @click="saveTest()"
            small
            >Guardar</v-btn
          >
        </div>
      </div>
    </v-dialog>
    <!-- DLG PASSWORD -->
    <v-dialog v-model="dialog_password" max-width="400">
      <form @submit.prevent="updatePassword()" class="m-card">
        <div class="m-card__body">
          <div class="close-modal">
            <h3>Cambiar Contraseña</h3>
            <v-btn class="mx-2" icon small @click="dialog_password = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <v-text-field
            class="mt-4 text-field"
            type="password"
            v-model="current_password"
            :maxlength="User.password.max_length"
            label="Contraseña actual"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            class="text-field"
            v-model="new_password"
            :maxlength="User.password.max_length"
            label="Nueva contraseña"
            required
          ></v-text-field>
          <v-text-field
            type="password"
            class="text-field"
            v-model="confirm_new_password"
            :maxlength="User.password.max_length"
            label="Confirmar nueva contraseña"
            required
          ></v-text-field>
        </div>
        <div class="m-card__actions">
           <m-btn
            type="button"
            small
            text
            class="cancel-button"
            @click="dialog_password = false"
            >Cancelar</m-btn
          >
          <m-btn color="primary" small>Guardar</m-btn>
        </div>
      </form>
    </v-dialog>
    <!-- DLG TEST 2 -->
    <v-dialog v-model="dialog_test_2" max-width="1000">
      <div v-if="profile.learning_style" class="m-card">
        <div class="m-card__body">
          <div class="close-modal learn-md">
            <h3>Estilos de aprendizaje</h3>
            <v-btn class="mx-2" icon small @click="dialog_test_2 = false">
              <v-icon> mdi-close-thick </v-icon>
            </v-btn>
          </div>
          <p v-if="profile.learning_style.procesamiento === 'activo'">
            <strong>ACTIVO:</strong> Prefiere hacer cosas que puede comprobar en
            el mundo real. Tiende a ser extrovertido. No aprende de situaciones
            que requieren pasividad o espera, pues es de naturaleza impaciente y
            siente que si no está haciendo algo está perdiendo el tiempo. Tiende
            a iniciar de inmediato las cosas por hacer, sin pensarlas demasiado.
            Trabaja mejor en equipo y acumula conocimiento de lo que va
            viviendo, por lo cual los talleres y casos prácticos le van bien.
          </p>
          <p v-else>
            <strong>REFLEXIVO:</strong> Prefiere hacer las cosas cuando ha
            meditado con anterioridad las posibilidades y las consecuencias de
            lo que puede pasar. Es introspectivo y dado a la reflexión. Se
            desconcierta en situaciones que requieren respuestas inmediatas,
            pues no tiene tiempo para pensar bien el escenario que enfrentan.
            Trabaja mejor individualmente o en compañía de una persona. Aprende
            de los modelos teóricos y de la reflexión, por lo cual cursos y
            manuales le van bien.
          </p>

          <p v-if="profile.learning_style.percepcion === 'sensorial'">
            <strong>SENSITIVO:</strong> Prefiere los hechos, los datos y la
            experimentación. Prefiere resolver problemas usando métodos estándar
            ya probados, y por tanto no le gustan las sorpresas. Es paciente,
            detallista, y no les gustan las complicaciones innecesarias. Es
            bueno memorizando hechos o datos. Prefiere aquello que es simple y
            evidente. Es cauteloso, lo que puede provocar que sea un poco lento.
            Se siente cómodo con las experiencias.
          </p>
          <p v-else>
            <strong>INTUITIVO:</strong> Prefiere los principios y las teorías.
            Le gusta la innovación y le disgusta o aburre hacer siempre lo mismo
            de la misma manera. Es impaciente, le aburre el detalle y ve como un
            reto las complicaciones. Es bueno desarrollando nuevos conceptos y
            cambiando los existentes: es creativo y resolutor de problemas
            nuevos. Es rápido, pero poco cauteloso. Se siente cómodo con los
            símbolos.
          </p>

          <p v-if="profile.learning_style.entrada === 'visual'">
            <strong>VISUAL:</strong> Le gusta ver formas, dibujos, colores,
            diagramas, símbolos. Recuerda aquellas cosas que ve y percibe al
            verlas. Para aprender y expresarse le van mejor los medios
            audiovisuales y multimedia. Es bueno para representar ideas que son
            difíciles de explicar con palabras.
          </p>
          <p v-else>
            <strong>VERBAL:</strong> Le gustan las palabras: decirlas,
            escribirlas y oírlas. Recuerda lo que dice, escribe o escucha en
            forma de palabras. Prefiere la lectura y el discurso, pone atención
            a los conceptos y es bueno para entender y argumentar de manera
            lógica las situaciones.
          </p>

          <p v-if="profile.learning_style.comprension === 'secuencial'">
            <strong>SECUENCIAL:</strong> Prefiere la exposición al conocimiento
            de manera ordenada y progresiva y no tiene problema en aprender las
            cosas por partes, una después de la otra. Sigue un proceso de
            razonamiento lineal para resolver problemas. Se siente cómodo con
            material que conoce parcialmente. Se le da el análisis, aprende y se
            comunica bien en una progresión de lo básico a lo complejo. Puede
            aprender las cosas gradualmente, con la desventaja de que puede
            olvidar partes aprendidas anteriormente a la llegada de nuevo
            conocimiento.
          </p>
          <p v-else>
            <strong>GLOBAL:</strong> Prefiere la exposición de todo el
            conocimiento junto. Sigue un proceso intuitivo para resolver
            problemas y se siente incómodo con información incompleta o poco
            profunda. Es bueno para la síntesis y no tiene problemas para ir
            directamente a lo complejo de un tema, tratando de descifrarlo.
            Parece no entender nada, hasta que de pronto lo entiende todo; lo
            cual puede generar impaciencia en las personas de estilo secuencial.
            Batalla para aprender, pero una vez que aprende algo no olvida
            detalle, pues requiere del todo para entenderlo. Es capaz de ver
            todo el panorama de una situación.
          </p>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import Chart from "chart.js";
import { updateLearningStyle } from "@/services/studentService";
import { getUser, updatePassword } from "@/services/userService";
import { scrollTop } from "@/services/scroll";
import { TextToSpeech } from "@/services/speech";
import User from "@/models/User";

class PreguntaTest {
  constructor(enunciado, alternatives) {
    this.enunciado = enunciado;
    this.alternatives = alternatives;
    this.answer = null;
  }
}

export default {
  data: () => ({
    profile: {
      _id: {},
    },
    questions: [
      /* 1 - 11 */
      new PreguntaTest("Entiendo mejor algo", [
        "si lo practico",
        "si pienso en ello",
      ]),
      new PreguntaTest("Me considero", ["realista", "innovador"]),
      new PreguntaTest(
        "Cuando pienso acerca de lo que hice ayer, es más probable que lo haga sobre la base de",
        ["una imagen", "palabras"]
      ),
      new PreguntaTest("Tengo tendencia a", [
        "entender los detalles de un tema pero no ver claramente su estructura completa",
        "entender la estructura completa pero no ver claramente los detalles",
      ]),
      new PreguntaTest("Cuando estoy aprendiendo algo nuevo, me ayuda", [
        "hablar de ello",
        "pensar en ello",
      ]),
      new PreguntaTest("Si yo fuera profesor, yo preferiría dar un curso", [
        "que trate sobre hechos y situaciones reales de la vida",
        "que trate con ideas y teorías",
      ]),
      new PreguntaTest("Prefiero obtener información nueva de", [
        "imágenes, diagramas, gráficas o mapas",
        "instrucciones escritas o información verbal",
      ]),
      new PreguntaTest("Una vez que entiendo", [
        "todas las partes, entiendo el total",
        "el total de algo, entiendo como encajan sus partes",
      ]),
      new PreguntaTest(
        "En un grupo de estudio que trabaja con un material difícil, es más probable que",
        ["participe y contribuya con ideas", "no participe y solo escuche"]
      ),
      new PreguntaTest("Es más fácil para mí", [
        "aprender hechos",
        "aprender conceptos",
      ]),
      new PreguntaTest(
        "En un libro con muchas imágenes y gráficas es más probable que",
        [
          "revise cuidadosamente las imágenes y las gráficas",
          "me concentre en el texto escrito",
        ]
      ),
      /* 12 - 22 */
      new PreguntaTest("Cuando resuelvo problemas de matemáticas", [
        "generalmente trabajo sobre las soluciones con un paso a la vez",
        "frecuentemente sé cuales son las soluciones, pero luego tengo dificultad para imaginarme los pasos para llegar a ellas",
      ]),
      new PreguntaTest("En las clases a las que he asistido", [
        "he llegado a saber como son muchos de los estudiantes",
        "raramente he llegado a saber como son muchos estudiantes",
      ]),
      new PreguntaTest("Cuando leo temas que no son de ficción, prefiero", [
        "algo que me enseñe nuevos hechos o me diga como hacer algo",
        "algo que me dé nuevas ideas en que pensar",
      ]),
      new PreguntaTest("Me gustan los maestros", [
        "que utilizan muchos esquemas en el pizarrón",
        "que toman mucho tiempo para explicar",
      ]),
      new PreguntaTest("Cuando estoy analizando un cuento o una novela", [
        "pienso en los incidentes y trato de acomodarlos para configurar los temas",
        "me doy cuenta de cuáles son los temas cuando termino de leer y luego tengo que regresar y encontrar los incidentes que los demuestran",
      ]),
      new PreguntaTest(
        "Cuando comienzo a resolver un problema de tarea, es más probable que",
        [
          "comience a trabajar en su solución inmediatamente",
          "primero trate de entender completamente el problema",
        ]
      ),
      new PreguntaTest("Prefiero la idea de", ["certeza", "teoría"]),
      new PreguntaTest("Recuerdo mejor", ["lo que veo", "lo que oigo"]),
      new PreguntaTest("Es más importante para mí que un profesor", [
        "exponga el material en pasos secuenciales claros",
        "me dé un panorama general y relacione el material con otros temas",
      ]),
      new PreguntaTest("Prefiero estudiar", ["en un grupo de estudio", "solo"]),
      new PreguntaTest("Me considero", [
        "cuidadoso en los detalles de mi trabajo",
        "creativo en la forma en la que hago mi trabajo",
      ]),
      /* 23 - 33 */
      new PreguntaTest(
        "Cuando alguien me da direcciones de nuevos lugares, prefiero",
        ["un mapa", "instrucciones escritas"]
      ),
      new PreguntaTest("Aprendo", [
        "a un paso constante. Si estudio con ahínco consigo lo que deseo",
        "en inicios y pausas. Me llego a confundir y súbitamente lo entiendo",
      ]),
      new PreguntaTest("Prefiero primero", [
        "hacer algo y ver que sucede",
        "pensar como voy a hacer algo",
      ]),
      new PreguntaTest(
        "Cuando leo por diversión, me gustan los escritores que",
        [
          "dicen claramente los que desean dar a entender",
          "dicen las cosas en forma creativa e interesante",
        ]
      ),
      new PreguntaTest(
        "Cuando veo un esquema o bosquejo en clase, es más probable que recuerde",
        ["la imagen", "lo que el profesor dijo acerca de ella"]
      ),
      new PreguntaTest("Cuando me enfrento a un cuerpo de información", [
        "me concentro en los detalles y pierdo de vista el total de la misma",
        "trato de entender el todo antes de ir a los detalles",
      ]),
      new PreguntaTest("Recuerdo más fácilmente", [
        "algo que he hecho",
        "algo en lo que he pensado mucho",
      ]),
      new PreguntaTest("Cuando tengo que hacer un trabajo, prefiero", [
        "dominar una forma de hacerlo",
        "intentar nuevas formas de hacerlo",
      ]),
      new PreguntaTest("Cuando alguien me enseña datos, prefiero", [
        "gráficas",
        "resúmenes con texto",
      ]),
      new PreguntaTest("Cuando escribo un trabajo, es más probable que", [
        "lo haga (piense o escriba) desde el principio y avance",
        "lo haga (piense o escriba) en diferentes partes y luego las ordene",
      ]),
      new PreguntaTest(
        "Cuando tengo que trabajar en un proyecto de grupo, primero quiero",
        [
          'realizar una "tormenta de ideas" donde cada uno contribuye con ideas',
          'realizar la "tormenta de ideas" en forma personal y luego juntarme con el grupo para comparar las ideas',
        ]
      ),
      /* 34 - 44 */
      new PreguntaTest("Considero que es mejor elogio llamar a alguien", [
        "sensible",
        "imaginativo",
      ]),
      new PreguntaTest(
        "Cuando conozco gente en una fiesta, es más probable que recuerde",
        ["cómo es su apariencia", "lo que dicen de sí mismos"]
      ),
      new PreguntaTest("Cuando estoy aprendiendo un tema, prefiero", [
        "mantenerme concentrado en ese tema, aprendiendo lo más que pueda de él",
        "hacer conexiones entre ese tema y temas relacionados",
      ]),
      new PreguntaTest("Me considero", ["abierto", "reservado"]),
      new PreguntaTest("Prefiero cursos que dan más importancia a", [
        "material concreto (hechos, datos)",
        "material abstracto (conceptos, teorías)",
      ]),
      new PreguntaTest("Para divertirme, prefiero", [
        "ver televisión",
        "leer un libro",
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
        "me cansa hacer su revisión y tengo que esforzarme para hacerlo",
      ]),
      new PreguntaTest("Tiendo a recordar lugares en los que he estado", [
        "fácilmente y con bastante exactitud",
        "con dificultad y sin mucho detalle",
      ]),
      new PreguntaTest(
        "Cuando resuelvo problemas en grupo, es más probable que yo",
        [
          "piense en los pasos para la solución de los problemas",
          "piense en las posibles consecuencias o aplicaciones de la solución en un amplio rango de campos",
        ]
      ),
    ],
    questions_page: 0,
    questions_size: 11,
    //
    user_role: -1,
    myChart: null,
    dialog_test: false,
    dialog_test_2: false,
    //
    current_password: "",
    new_password: "",
    confirm_new_password: "",
    dialog_password: false,
    User,
  }),
  computed: {
    _questions() {
      let questions = this.questions.slice(
        this.questions_page * this.questions_size,
        this.questions_page * this.questions_size + this.questions_size
      );
      return questions;
    },
  },
  async mounted() {
    this.showLoading("Cargando Datos");
    this.user_role = this.$store.state.user.role;
    try {
      this.profile = await getUser();
    } catch (error) {
      this.showMessage("", error.msg || error);
    }
    this.hideLoading();

    // Chart
    if (this.user_role === "STU") {
      var ctx = document.getElementById("myChart").getContext("2d");
      this.myChart = new Chart(ctx, {
        type: "bar",
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  max: 11,
                  stepSize: 1,
                },
              },
            ],
          },
        },
      });
      this.updateDashboard();
    }
  },
  methods: {
    async saveTest() {
      let answers = this.questions.map((q) => q.answer);
      if (!answers.includes(null)) {
        this.showLoading("Guardando");
        this.dialog_test = false;
        let learning_style = this.calculate(answers);
        this.profile.learning_style = learning_style;
        try {
          await updateLearningStyle(learning_style);
          this.updateDashboard();
        } catch (error) {
          this.showMessage("", error.msg || error);
        }
        this.hideLoading();
      } else {
        this.showMessage("Alerta", "No dejes preguntas sin responder.");
      }
    },
    async updatePassword() {
      if (this.new_password !== this.confirm_new_password) {
        this.showMessage("", "Las contraseñas no coinciden.");
        return;
      }

      this.showLoading("Cambiando Contraseña");
      this.dialog_password = false;
      try {
        await updatePassword(this.current_password, this.new_password);
        this.showMessage("", "Contraseña modificada.");
      } catch (error) {
        this.showMessage("", error.msg || error);
      }
      this.hideLoading();
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
        comprension_valor: comprension_valor,
      };
      return perfil;
    },
    updateDashboard() {
      if (this.profile.learning_style) {
        let {
          procesamiento,
          procesamiento_valor,
          percepcion,
          percepcion_valor,
          entrada,
          entrada_valor,
          comprension,
          comprension_valor,
        } = this.profile.learning_style;
        this.myChart.data = {
          labels: [procesamiento, percepcion, entrada, comprension],
          datasets: [
            {
              label: ["Estilo de Aprendizaje"],
              data: [
                procesamiento_valor,
                percepcion_valor,
                entrada_valor,
                comprension_valor,
              ],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        };
        this.myChart.update();
      }
    },
    newTest() {
      this.questions_page = 0;
      this.questions.forEach((q) => {
        q.answer = null;
        // q.answer = Math.round(Math.random());
      });
      this.dialog_test = true;
    },
    changePage(n) {
      let answers = this._questions.map((q) => q.answer);
      if (n === -1 || !answers.includes(null)) {
        scrollTop("test");
        this.questions_page += n;
      } else {
        this.showMessage("Alerta", "No dejes preguntas sin responder.");
      }
    },
    talk(text) {
      TextToSpeech(text);
    },
  },
};
</script>

<style lang='scss' scoped>
.profile {
  max-width: 500px;
  margin: 0 auto;

  &__title {
    font-size: 1.2rem;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--color-subtitle);
  }
  &__content {
    margin-top: 16px;
    font-size: 1rem;
    font-weight: lighter;
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    align-items: center;
  }
  &__icon {
    margin-bottom: 2px;
    font-size: 1.2rem;
  }
  &__item {
    font-size: 0.95rem;
    font-weight: bold;
  }
  &__value {
    margin-left: 12px;
    padding: 6px 18px;
    background: #eeeeee;
    font-size: 0.9rem;
    border-radius: 20px;
  }
  &__actions {
    display: flex;
    justify-content: flex-end;
  }
}

.diagram {
  max-width: 500px;
  margin: 0 auto;
  margin-top: 18px;
  padding: 3%;
  padding-bottom: 0;

  &__actions {
    padding: 20px 0;
    display: flex;
    justify-content: center;
  }
}

.test {
  max-height: calc(85vh);
  overflow-y: auto;
  padding: 20px 26px;
  background: #fff;
  border-radius: 0;
  &__title {
    font-size: 1.3rem;
    text-align: center;
  }
  &__page {
    width: max-content;
    margin: 10px auto;
    padding: 4px 12px;
    background: #447fff;
    color: #fff;
    text-align: center;
    font-weight: bold;
    border-radius: 8px;
  }
  &__question {
    padding: 16px 0;
    font-size: 0.9rem;
    &-title {
      padding-bottom: 5px;
    }
  }
}

.no-style {
  padding: 20px;
  color: #a19f9f;
  border: 2px dashed #d4d4d4;
  border-radius: 10px;
  font-size: 1.4rem;
  text-align: center;
}

.close-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-m {
  margin-left: 28%;
}

.learn-md {
  padding: 10px 0px;
}

.cancel-button {
  background: none;
  border: 1px solid gray;
  margin-right: 8px;
}

@media (max-width: 860px) {
  .close-m {
  margin-left: 25%;
  }
}

@media (max-width: 680px) {
  .close-m {
  margin-left: 19%;
  }
}

@media (max-width: 580px) {
  .close-m {
  margin-left: 12%;
  }
}

@media (max-width: 440px) {
  .close-m {
  margin-left: 8%;
  }

  .test {
    padding: 20px 20px;
  }
}

</style>