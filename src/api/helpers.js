import router from "../router";
import store from "../store";

function getApiUrl() {
  let base_url = process.env.VUE_APP_API_URL || "http://localhost:5000";
  // let base_url = "http://localhost:5000";
  return `${base_url}/api/v1`;
}

function getHeaders(isJSON = true) {
  let token = localStorage.getItem("token");
  let headers = {
    Authorization: `Bearer ${token}`,
  };
  if (isJSON)
    headers["Content-Type"] = "application/json"
  return headers
}

async function _fetch(method, name, data, isJSON = true) {
  let res = await fetch(`${getApiUrl()}/${name}`, {
    method,
    body: isJSON ? JSON.stringify(data) : data,
    headers: getHeaders(isJSON)
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
      router.push("/").catch(() => { });
    }
  }
}

export { _fetch };
