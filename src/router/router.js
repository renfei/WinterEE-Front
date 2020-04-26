import Main from '@/Main.vue'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import LockScreen from '@/views/LockScreen.vue'
import SettingMenu from '../views/SettingMenu.vue'
import SettingTenant from '../views/SettingTenant.vue'
import SettingLog from '../views/SettingLog.vue'

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

        },
        {
            path: 'setting/menu', meta: {title: "Setting Menu"}, name: 'settingMenu', component: SettingMenu
        },
        {
            path: 'setting/tenant', meta: {title: "Setting Tenant"}, name: 'settingTenant', component: SettingTenant
        },
        {
            path: 'setting/log', meta: {title: "Logs"}, name: 'settingLog', component: SettingLog
        }
    ]
};
const routers = [
    signInRouter,
    lockcreenRouter,
    otherRouter
];
export default routers
