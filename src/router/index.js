import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import User from '@/components/User'
import Rights from '@/components/Rights'
import Role from '@/components/Role'
import Cat from '@/components/Cat'
import Param from '@/components/Param'
import Goods from '@/components/Goods'
import GoodsAdd from '@/components/GoodsAdd'
import Order from '@/components/Order'
import Report from '@/components/Report'

Vue.use(Router)

const router = new Router({
  routes: [
    // { path: '/',name: 'HelloWorld',component: HelloWorld}
    { path: '/', redirect: '/home' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Role },
        { path: '/categories', component: Cat },
        { path: '/params', component: Param },
        { path: '/goods', component: Goods },
        { path: '/goodsadd', component: GoodsAdd },
        { path: '/orders', component: Order },
        { path: '/Reports', component: Report }
      ]
    }
  ]
})

router.beforeEach((to, form, next) => {
  var token = window.sessionStorage.getItem('token')
  if (token === null && to.path !== '/login') {
    return next('/login')
  }
  next()
})
export default router
