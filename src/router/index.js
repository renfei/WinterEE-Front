import Vue from 'vue'
import VueRouter from 'vue-router'
import routers  from './router';
import Utils from '../libs/utils';
import {getStore, setStore} from '../libs/storage';

Vue.use(VueRouter)

const RouterConfig = {
    // mode: 'history',
    routes: routers
}

const router = new VueRouter(RouterConfig)

router.beforeEach((to, from, next) => {
    Utils.title(to.meta.title);
    if (getStore('lockscreen') === '1' && to.name !== 'lockscreen') {
        // 判断当前是否是锁定状态
        next({
            replace: true,
            name: 'lockscreen'
        });
    } else if (getStore('lockscreen') === '0' && to.name === 'lockscreen') {
        next(false);
    } else {
        if (!getStore('userInfo') && to.name !== 'signin' && to.name !== 'regist' && to.name !== 'regist-result' && to.name !== 'relate') { // 判断是否已经登录且前往的页面不是登录页
            next({
                name: 'signin'
            });
        } else if (getStore('userInfo') && to.name === 'signin') {
            // 判断是否已经登录且前往的是登录页
            Utils.title();
            next({
                name: 'home'
            });
        } else {
            Utils.toDefaultPage([...routers], to.name, router, next);
        }
    }
});

router.afterEach((to) => {
    to.meta.title
})

export default router
