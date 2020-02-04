import { fetch_post } from "./constants";

function loginTeacher(user, pass) {
  return fetch_post('iniciarSesionProfesor', {
    codigo: user,
    contrasena: pass
  })
}

function loginStudent(user, pass) {
  return fetch_post('iniciarSesionProfesor', {
    codigo: user,
    contrasena: pass
  })
}

export { loginTeacher, loginStudent }