//import { fetch_get } from "./fetch";

function index() {
  //return fetch_get('api/v1/subject')
  return new Promise((resolve) => {

      resolve([ { id: "aa", name: "Matematicas "}]); // ¡Todo salió bien!
  
  });
}


export { index }