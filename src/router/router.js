import Main from '@/Main.vue'
import Home from '@/views/Home.vue'
import SignIn from '@/views/SignIn.vue'
import LockScreen from '@/views/LockScreen.vue'
import SettingMenu from '../views/SettingMenu.vue'
import SettingTenant from '../views/SettingTenant.vue'
import SettingLog from '../views/SettingLog.vue'
import SettingOAuthClient from '../views/SettingOAuthClient.vue'
import SettingTenantInfo from '../views/SettingTenantInfo.vue'

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
            path: 'setting/tenantinfo', meta: {title: "Setting Tenant Info"}, name: 'settingTenantInfo', component: SettingTenantInfo
        },
        {
            path: 'setting/log', meta: {title: "Logs"}, name: 'settingLog', component: SettingLog
        },
        {
            path: 'setting/oauthclient', meta: {title: "OAuthClient"}, name: 'settingOAuthClient', component: SettingOAuthClient
        }
    ]
};
const routers = [
    signInRouter,
    lockcreenRouter,
    otherRouter
];
export default routers
