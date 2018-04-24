import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import dashboard from '../components/dashboard.vue'
import askleave from '../components/askleave.vue'
import askovetime from '../components/askovertime.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'dashboard',
      component: dashboard,
      children: [
        { path: 'askleave', component: askleave, name: 'leave' },
        { path: 'askovertime', component: askovetime, name: 'overtime' }
      ]
    }
  ]
})
