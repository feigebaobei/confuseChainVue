import Vue from 'vue'
import VueRouter from 'vue-router'
// import index from '../page/index.vue'
import checkValidity from '../page/claim/checkValidity.vue'
import claimIndex from '../page/claim/index.vue'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Index',
  //   component: index
  // },
  {
    path: '/claim',
    // name: 'claim',
    component: claimIndex,
    children: [
      {
        path: 'checkValidity',
        component: checkValidity
      }
    ]
    // component: checkValidity
  }
]
const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
export default router