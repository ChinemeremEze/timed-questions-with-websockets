import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import App from './App.vue'
import Home from './views/Home'
import Teacher from './views/Teacher'
import Student from './views/Student'

const vueSocketIO = new VueSocketIO({
  debug: true,
  connection: SocketIO('http://localhost:3000', {}),
})

Vue.config.productionTip = false

const routes = [
  { path: '/', component: Home },
  { path: '/teacher', component: Teacher },
  { path: '/student', component: Student }
]

Vue.use(vueSocketIO)
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
