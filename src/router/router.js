import i18n from '../locales/i18n'
import Main from '@/Main.vue'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import LockScreen from '@/views/LockScreen.vue'

const signInRouter = {
    path: '/signin',
    name: 'signin',
    meta: {
        title: '登录 '
    },
    component: SignIn
};
const lockcreenRouter = {
    path: '/lockscreen',
    name: 'lockscreen',
    meta: {
        title: '锁屏'
    },
    component: LockScreen
};
const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {
            path: 'home', meta: {title: "Home"}, name: 'home', component: Home
        }
    ]
};
const routers = [
    signInRouter,
    lockcreenRouter,
    otherRouter
];
export default routers
