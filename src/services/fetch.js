import router from "../router";
import store from "../store";

// const service = "http://localhost:5000";
const service = "https://braintutor-service-v2.herokuapp.com";

function getHeaders() {
  let token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetch_get(name) {
  let res = await fetch(`${service}/${name}`, { headers: getHeaders() });
  let json = await res.json();
  if (res.status >= 400 && res.status < 600) {
    handlerCode(json.code);
    throw json;
  }

  return json;
}

async function fetch_post(name, data) {
  let res = await fetch(`${service}/${name}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: getHeaders(),
  });
  let json = await res.json();
  if (res.status >= 400 && res.status < 600) {
    handlerCode(json.code);
    throw json;
  }

  return json;
}

function handlerCode(code) {
  if (code) {
    // TOKEN EXPIRED
    if (code == "1000") {
      localStorage.removeItem("token");
      store.commit("setUser", null);
      router.push("/").catch(() => {});
    }
  }
}

export { service, fetch_get, fetch_post, getHeaders };
