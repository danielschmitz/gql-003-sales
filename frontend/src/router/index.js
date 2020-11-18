import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/users',
    name: 'Users',
    meta: { requiresAuth: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "user" */ '../views/Users.vue')
  },
  {
    path: '/categories',
    name: 'Categories',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "categories" */ '../views/Categories.vue')
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "suppliers" */ '../views/Suppliers.vue')
  },
  {
    path: '/customers',
    name: 'Customers',
    meta: { requiresAuth: true },
    component: () => import(/* webpackChunkName: "customers" */ '../views/Customers.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.token) {
      return next({
        path: '/'
      })
    }
  }
  return next()
})


export default router
