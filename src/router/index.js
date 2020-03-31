import Vue from 'vue'
import VueRouter from 'vue-router'
import routers  from './router';

Vue.use(VueRouter)

const RouterConfig = {
    // mode: 'history',
    routes: routers
}

const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    to.meta.title
    next()
})

router.afterEach((to) => {
    to.meta.title
})

export default router
