import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './styles/main.scss'
import 'normalize.css'
import firebase from 'firebase/app'

Vue.config.productionTip = false

firebase.initializeApp({
  "apiKey": "AIzaSyBQgYiw2hhDBABjv35g6M7JDthTt6c7xjM",
  "authDomain": "brain-tutor.firebaseapp.com",
  "databaseURL": "https://brain-tutor.firebaseio.com",
  "projectId": "brain-tutor",
  "storageBucket": "brain-tutor.appspot.com",
  "messagingSenderId": "817254038184",
  "appId": "1:817254038184:web:8174dba041d8afaf37609d",
  // "measurementId": "G-T66ZJQK7D4",
  // "serviceAccount": 'credentials.json'
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
