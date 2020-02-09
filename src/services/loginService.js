import { fetch_post } from "./fetch";

function loginTeacher(user, pass) {
  return fetch_post('iniciarSesionProfesor', {
    codigo: user,
    contrasena: pass
  })
}

function loginStudent(user, pass) {
  return fetch_post('iniciarSesionAlumno', {
    codigo: user,
    contrasena: pass
  })
}

export { loginTeacher, loginStudent }